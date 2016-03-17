/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobs/              ->  index
 * POST    /api/jobs/              ->  create
 * GET     /api/jobs//:id          ->  show
 * PUT     /api/jobs//:id          ->  update
 * DELETE  /api/jobs//:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Applicant, Resume, ApplicantState, QueuedTask, Solr, Job, Email, PhoneNumber, Experience, Education,
  JobApplication, ApplicantDownload, ApplicantSkill, User ,STAKEHOLDERS,BUCKETS} from '../../../sqldb';
import phpSerialize from './../../../components/php-serialize';
import config from './../../../config/environment';
import util from 'util';
import formidable from 'formidable';
import fsp from 'fs-promise';
import mkdirp from 'mkdirp-then';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode, err) {
  statusCode = statusCode || 500;
  res.status(statusCode).json(err);
}

// Gets a list of Applicants
export function index(req, res) {

  const offset = req.query.offset || 0;
  const limit = (req.query.limit > 20) ? 20 : req.query.limit || 10;
  const fl = req.query.fl || [
      'id', 'name', 'exp_designation', 'edu_degree', 'exp_salary',
      'exp_employer', 'total_exp', 'exp_location', 'state_id',
      'state_name', 'applicant_score', 'created_on'
    ].join(',');

  const rawStates = (req.query.state_id) ? req.query.state_id.split(',') : ['ALL'];
  const bucket = BUCKETS[STAKEHOLDERS[req.user.group_id]]; // stakeholder is 2|consultant 5|client

  let solrSelect = `type_s=applicant`;

  if (req.user.group_id == 2) { // if consultant
    solrSelect += `AND owner_id:${req.user.id} AND _root_:${req.params.jobId}`
  }

  const states = [];
  rawStates.forEach(function normalize(state) {
    if (isNaN(state)) if (bucket[state]) bucket[state].map(s => states.push(s));

    if (_.isInteger(state) || ~bucket.ALL.indexOf(Number(state))) states.push(Number(state));
  });


  const solrQuery = Solr.createQuery()
    .q(solrSelect)
    .fl(fl)
    .matchFilter('state_id', `(${states.join(' OR ')})`)
    .start(offset)
    .rows(limit);

  if (req.query.interview_time) {
    solrQuery.rangeFilter([
      {
        field: 'interview_time',
        start: req.query.interview_time.split(',')[0] || '*',
        end: req.query.interview_time.split(',')[1] || '*'
      }
    ]);
  }

  Solr.get('select', solrQuery, function solrCallback(err, result) {
    if (err) return handleError(res, 500, err);
    res.json(result.response.docs);
  });
}

function validateEmailId(jobId, email) {
  return JobApplication.findAll({
    attributes: ['id'],
    where: {
      job_id: jobId
    },
    include: [
      {
        model: Applicant,
        attributes: ['id'],
        include: [
          {
            model: Email,
            attributes: ['id'],
            where: {
              email: email,
              status: 1
            }
          }
        ]
      }
    ]
  }).then(rows => {
    if (rows.length > 0) {
      return Promise.resolve(1)
    } else {

      return Promise.resolve(0)
    }
  }).catch(err => {
  })
}

function validatePhoneNumber(jobId, number) {
  return JobApplication.findAll({
    attributes: ['id'],
    where: {
      job_id: jobId
    },
    include: [
      {
        model: Applicant,
        attributes: ['id'],
        include: [
          {
            model: PhoneNumber,
            attributes: ['id'],
            where: {
              number: number,
              status: 1
            }
          }
        ]
      }
    ]
  }).then(rows => {
    if (rows.length > 0) {
      return Promise.resolve(1)
    } else {

      return Promise.resolve(0)
    }
  }).catch(err => {

  })
}

// Check Already Applied
export function alreadyApplied(req, res){
  const validatePhoneNumberPromise = req.query.number ? validatePhoneNumber(req.params.jobId, req.query.number) : Promise.resolve(0);
  const validateEmailIdPromise = req.query.email ? validateEmailId(req.params.jobId, req.query.email) : Promise.resolve(0);

  return Promise.all([validateEmailIdPromise, validatePhoneNumberPromise])
    .then(function (validationResultArray) {
      const emailValidationResult = validationResultArray[0];
      const phoneValidationResult = validationResultArray[1];
      res.json({
        message: "phone or email conflict",
        email: emailValidationResult,
        number: phoneValidationResult
      })
})
}

export function saveApplicant(applicantDetails,stateId){
  const emailForValidation = applicantDetails.email_id;
  const numberForValidation = applicantDetails.number;

  const jobId = applicantDetails.jobId;

  const validatePhoneNumberPromise = validatePhoneNumber(jobId, numberForValidation);
  const validateEmailIdPromise = validateEmailId(jobId, emailForValidation);
  // TODO Validatio for email id and phone number for same job

  return Promise.all([validateEmailIdPromise, validatePhoneNumberPromise])
    .then(function (validationResultArray) {
      const emailValidationResult = validationResultArray[0];
      const phoneValidationResult = validationResultArray[1];
      if (emailValidationResult == 1 || phoneValidationResult == 1) {
        return Promise.reject({
          code:409,
          message: "phone or email conflict",
          email: emailValidationResult,
          number: phoneValidationResult
        })

      } else {
        applicantDetails.updated_by = applicantDetails.created_by = applicantDetails.user_id;
        return Applicant.build(applicantDetails)
          .save()
          .then(function tempName(applicant) {
            let generatedResponseId = applicant.id;
            let rootFolderName = config.QDMS_PATH + "/Applicants/" + (generatedResponseId - (generatedResponseId % 10000)) + "/" + generatedResponseId + "/";
            let fileName = applicantDetails.fileUpload.name;
            return fsp.readFile(applicantDetails.fileUpload.path).then(function (data) {
              //applicantDetails.fileUpload.path

              return mkdirp(rootFolderName).then(function () {
                let fileExtension = fileName.split(".").pop();
                let allowedExtType = ['doc', 'docx', 'pdf', 'rtf', 'txt'];
                // TODO Discuss on file type saving logic
                if (allowedExtType.indexOf(fileExtension) === -1) {
                  return Promise.reject({code:500, desc: "File Type Not Allowed"});
                }
                let finalFileName = rootFolderName + generatedResponseId + "." + fileExtension;
                return fsp.writeFile(finalFileName, data).then(function() {
                  // Generating Data to Insert Into Resume table Starts Here
                  let resumeData = {
                    applicant_id: generatedResponseId,
                    contents: 'Please wait the file is under processing',
                    path: 'Applicants/' + (generatedResponseId - (generatedResponseId % 10000)) +'/' + generatedResponseId + '/' + generatedResponseId + "." +fileExtension
                  };
                  const resumePromise = Resume.create(resumeData);
                  // Generating Data to Insert Into Resume table Starts Here

                  // Generating Data to Insert Into ApplicantState table Starts Here
                  let applicantStateData = {
                    applicant_id: generatedResponseId,
                    user_id: applicantDetails.user_id,
                    state_id: stateId ? stateId : '27' // 27 => Screening Pending 
                  };

                  const applicateStatePromise = ApplicantState.create(applicantStateData);
                  // Generating Data to Insert Into ApplicantState table Starts Here

                  // Generating Data to Insert Into Email table Starts Here
                  let emailData = {
                    applicant_id: generatedResponseId,
                    email: applicantDetails.email_id
                  };
                  const emailPromise = Email.create(emailData);
                  // Generating Data to Insert Into Email table Starts Here


                  // Generating Data to Insert Into PhoneNumber table Starts Here
                  let phoneNumberData = {
                    applicant_id: generatedResponseId,
                    number: applicantDetails.number
                  };
                  const phoneNumberPromise = PhoneNumber.create(phoneNumberData);
                  // Generating Data to Insert Into PhoneNumber table Starts Here

                  // Generating Data to Insert Into JobApplication table Starts Here
                  let jobApplicationData = {
                    applicant_id: generatedResponseId,
                    job_id: applicantDetails.jobId
                  };
                  const jobApplicationPromise = JobApplication.create(jobApplicationData);

                  // Generating Data to Insert Into JobApplication table Starts Here

                  // Generating Data to Insert Into Experience table Starts Here
                  let experienceData = {
                    applicant_id: generatedResponseId,
                    employer_id: applicantDetails.employer_id,
                    designation_id: applicantDetails.designation_id,
                    region_id: applicantDetails.region_id,
                    salary: applicantDetails.salary
                  };
                  const experiencePromise = Experience.create(experienceData);
                  // Generating Data to Insert Into Experience table Starts Here

                  // Generating Data to Insert Into Education table Starts Here
                  let educationData = {
                    applicant_id: generatedResponseId,
                    degree_id: applicantDetails.degree_id,
                    institute_id: 1
                  };
                  const educationPromise = Education.create(educationData);
                  // Generating Data to Insert Into Education table Starts Here


                  return Promise.all([resumePromise, applicateStatePromise, emailPromise, phoneNumberPromise, jobApplicationPromise, experiencePromise, educationPromise])
                    .then(promiseReturns => {
                      const applicateState = promiseReturns[1];
                      const resume = promiseReturns[0]
                      return applicant.update({applicant_state_id:applicateState.id}).then(updatedApplicant => {
                        return  {  message: "success", id: resume['applicant_id']};
                      })
                    })

                }); // writefile
              }); // mkdirp
            });//fs.readfile.then
          })

      }
    })

}

// Creates a new Applicant in the DB
export function create(req, res) {

  // parse a file upload Todo: file upload limit, extension
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    let applicant = JSON.parse(fields.payload);
    applicant.jobId = req.params.jobId;
    applicant.user_id = req.user.id;
    applicant.fileUpload = files.fileUpload;

    saveApplicant(applicant).then(function(saveStatus){
      res.json(saveStatus);
    }).catch(function(err){
      res.status(err.code||500).json(err)
    })
  });
}

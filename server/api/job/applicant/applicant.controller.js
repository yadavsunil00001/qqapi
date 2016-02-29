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
  JobApplication, ApplicantDownload, ApplicantSkill, User } from '../../../sqldb';
import buckets from './../../../config/buckets';
import stakeholders from './../../../config/stakeholders';
import phpSerialize from './../../../components/php-serialize';
import config from './../../../config/environment';
var util = require('util');
var formidable = require('formidable');
var fs = require('fs');
var mkdirp = require('mkdirp');


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
  const bucket = buckets[stakeholders[req.user.group_id]]; // stakeholder is 2|consultant 5|client

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
// Creates a new Applicant in the DB
export function create(req, res) {

  // parse a file upload
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    req.body = JSON.parse(fields.payload);
    const emailForValidation = req.body.email_id;
    const numberForValidation = req.body.number;
    const jobId = req.params.jobId;


    const validatePhoneNumberPromise = validatePhoneNumber(jobId, numberForValidation);
    const validateEmailIdPromise = validateEmailId(jobId, emailForValidation);
    // TODO Validatio for email id and phone number for same job

    return Promise.all([validateEmailIdPromise, validatePhoneNumberPromise])
      .then(function (validationResultArray) {
        const emailValidationResult = validationResultArray[0];
        const phoneValidationResult = validationResultArray[1];
        if (emailValidationResult == 1 || phoneValidationResult == 1) {
          res.status(409).json({
            message: "phone or email conflict",
            email: emailValidationResult,
            number: phoneValidationResult
          })
        } else {
          Applicant.build(req.body)
            .save()
            .then(function tempName(applicant) {
              let generatedResponseId = applicant.id;
              let rootFolderName = config.QDMS_PATH + "/Applicants/" + (generatedResponseId - (generatedResponseId % 10000)) + "/" + generatedResponseId + "/";
              let fileName = files.fileUpload.name;
              fs.readFile(files.fileUpload.path, function (err, data) {
                if (err) {
                  return res.json({err: err, desc: "read"});
                }
                mkdirp(rootFolderName, function (err) {
                  if (err) return res.json(err);
                  let fileExtension = fileName.split(".").pop();

                  let allowedExtType = ['doc', 'docx', 'pdf', 'rtf', 'txt'];
                  // TODO Discuss on file type saving logic
                  if (allowedExtType.indexOf(fileExtension) === -1) {
                    return res.json("File Type Not Allowed");
                  }
                  let finalFileName = rootFolderName + generatedResponseId + "." + fileExtension;
                  fs.writeFile(finalFileName, data, function (err) {
                    if (err) {
                      return res.json({err: err, desc: "write"})
                    }

                    // Generating Data to Insert Into Resume table Starts Here
                    let resumeData = {
                      applicant_id: generatedResponseId,
                      contents: 'Please wait the file is under processing',
                      path: 'Applicant/' + (generatedResponseId - (generatedResponseId % 10000)) / +'/' + generatedResponseId + '/' + generatedResponseId
                    };
                    const promise1 = Resume.create(resumeData);
                    // Generating Data to Insert Into Resume table Starts Here

                    // Generating Data to Insert Into ApplicantState table Starts Here
                    let applicantStateData = {
                      applicant_id: generatedResponseId,
                      user_id: req.user.id,
                      state_id: '1'
                    };
                    const promise2 = ApplicantState.create(applicantStateData);
                    // Generating Data to Insert Into ApplicantState table Starts Here

                    // Generating Data to Insert Into Email table Starts Here
                    let emailData = {
                      applicant_id: generatedResponseId,
                      email: req.body.email_id
                    };
                    const promise3 = Email.create(emailData);
                    // Generating Data to Insert Into Email table Starts Here


                    // Generating Data to Insert Into PhoneNumber table Starts Here
                    let phoneNumberData = {
                      applicant_id: generatedResponseId,
                      number: req.body.number
                    };
                    const promise4 = PhoneNumber.create(phoneNumberData);
                    // Generating Data to Insert Into PhoneNumber table Starts Here

                    // Generating Data to Insert Into JobApplication table Starts Here
                    let jobApplicationData = {
                      applicant_id: generatedResponseId,
                      job_id: req.params.jobId
                    };
                    const promise5 = JobApplication.create(jobApplicationData);

                    // Generating Data to Insert Into JobApplication table Starts Here

                    // Generating Data to Insert Into Experience table Starts Here
                    let experienceData = {
                      applicant_id: generatedResponseId,
                      employer_id: req.body.employer_id,
                      designation_id: req.body.designation_id,
                      region_id: req.body.region_id,
                      salary: req.body.salary
                    };
                    const promise6 = Experience.create(experienceData);
                    // Generating Data to Insert Into Experience table Starts Here

                    // Generating Data to Insert Into Education table Starts Here
                    let educationData = {
                      applicant_id: generatedResponseId,
                      degree_id: req.body.degree_id,
                      institute_id: 1
                    };
                    const promise7 = Education.create(educationData);
                    // Generating Data to Insert Into Education table Starts Here


                    return Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7])
                      .then(promiseReturns => {
                        return res.json({message: "success", id: promiseReturns[0]['applicant_id']});
                      })
                      .catch(err => handleError(res, 500, err))
                  });
                });
              });
            })
            .catch(err => handleError(res, 500, err));
        }
      })
      .catch(err => handleError(res, 302, err));
  });
}

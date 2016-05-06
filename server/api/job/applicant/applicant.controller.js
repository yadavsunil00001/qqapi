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
import db,{Applicant, Resume, ApplicantState, QueuedTask, Solr, Job, Email, PhoneNumber, Experience, Education,
  JobApplication, ApplicantDownload, ApplicantSkill, User ,STAKEHOLDERS,BUCKETS} from '../../../sqldb';
import phpSerialize from './../../../components/php-serialize';
import config from './../../../config/environment';
import util from 'util';
import formidable from 'formidable';
import path from 'path';
import slack from './../../../components/slack';

function logError(err) {
  console.log(err, "\n END")
}

function log(entity) {
  console.log(entity)
}

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
  console.log("handleError",err)
  slack("QUARCAPI: Error in applicant controller"+ (err.message ?err.message:""))
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

  const rawStates = (req.query.status) ? req.query.status.split(',') : ['ALL'];
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

// Check Already Applied
export function alreadyApplied(req, res) {
   Applicant.alreadyApplied(db,req.params.jobId,req.query.email,req.query.number)
    .then(status => {
      return res.json(_.extend({code: 409, message: "phone or email conflict"}, status))
    }).catch(err => handleError(res,500,err))
}

// Creates a new Applicant in the DB
export function create(req, res) {
  slack("Quarc API: applicant create: jobId" + req.params.jobId + ", applicant id:" )
  // parse a file upload Todo: file upload limit, extension
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if(err) return handleError(res,500,err);
    let applicant = JSON.parse(fields.payload);
    return Applicant.alreadyApplied(db, req.params.jobId, applicant.email_id, applicant.number)
      .then(status => {
        if (status.email === true || status.number === true) {
          slack("Quarc API: applicant create: jobId" + req.params.jobId + ", applicant name:"+applicant.name+", uploading by:" + req.user.id +", Already candidate uploaded with this Phone or Email")
          return res.status(409).json(_.extend({
            code: 409, message: "Already candidate uploaded with this Phone or Email"}, status))

        }
        var file = files.fileUpload;
        let fileExtension = file.name.split(".").pop(); // Extension
        let allowedExtType = ['doc', 'docx', 'pdf', 'rtf', 'txt'];

        if (allowedExtType.indexOf(fileExtension.toLowerCase()) === -1) {
          slack("Quarc API: applicant create: jobId" + req.params.jobId + ", applicant name:"+applicant.name+", uploading by:" + req.user.id +", File Type Not Allowed")
          return res.status(400).json({code: "400 Bad Request", message: "File Type Not Allowed"});
        }
        slack("Quarc API: applicant create: jobId" + req.params.jobId + ", applicant name:"+applicant.name+", uploading by:" + req.user.id )
        return Applicant.saveApplicant(db,applicant, file, req.user.id, req.params.jobId)
          .then(savedApplicant => res.json( _.pick(savedApplicant,['id'])))
      })
      .catch(err => handleError(res,500,err));
  });
}
export function reapply(req, res) {
  var jobId = req.params.jobId;
  var applicantId = req.body.applicant_id;

  Applicant.findById(applicantId,{
      include:[db.Resume,db.Email,db.PhoneNumber,db.Education]
    })

    .then(function (applicant) {
      return db.Applicant.alreadyApplied(db, jobId, applicant.Emails[0].email, applicant.PhoneNumbers[0].number)
        .then(status => {
          if (status.email === true || status.number === true) {
            return res.status(409).json({ message: 'Already applied'})
          }
          const userId = req.user.id
          let file = {
            name: applicant.Resumes[0].path.split('/').pop(),
            path: config.QDMS_PATH +  applicant.Resumes[0].path
          };

          const experiancePromise = db.Experience.find({
            where: {applicant_id: applicant.id},
            raw: true
          }).then(experiance => {
            var experiancePromises = [
              db.Region.findById(experiance.region_id),
              db.Employer.findById(experiance.employer_id),
              db.Designation.findById(experiance.designation_id)
            ]

            return Promise.all(experiancePromises).then(resolvedPromise => {
              const region = resolvedPromise[0] || {};
              const employer = resolvedPromise[1] || {};
              const designation = resolvedPromise[2] || {};
              experiance.region = region.region
              experiance.employer = employer.name
              experiance.designation = designation.name
              return experiance
            })
          });

          return Promise.all([experiancePromise]).then(prRe => {
            var experience = prRe[0];
            let applicantToSave = {
              name: applicant.name,
              expected_ctc: applicant.expected_ctc,
              salary: experience.salary,
              notice_period: applicant.notice_period,
              total_exp: applicant.total_exp,
              number: applicant.PhoneNumbers[0].number,
              email_id: applicant.Emails[0].email,
              employer_id: experience.employer_id, // TODO: Table restructure
              designation_id: experience.designation_id,
              region_id: experience.region_id,
              degree_id: applicant.Education[0].degree_id,
            };

            return Applicant.saveApplicant(db, applicantToSave, file, userId, jobId)
              .then(function (applicant) {
                return   res.status(201).json({
                  message:  'Approved',
                  id: applicant.id});
              })
          })

        })
      return res.json(applicant)
      //console.log(region)

    })
    .catch(err => handleError(res, 500, err));
}
export function show(req, res) {

  db.Applicant.getFullDetails(db, req.params.applicantId).then(applicant =>{
    function getExperienceMonth(input){
      if(typeof input === 'number') input = input.toString()
      if(!input) return input
      var split = (input + "").split(".")
      if(split.length == 2){
        var m = split[1];
        return parseInt(m[0] == "0" ? m[1]:m);
      } else { return ""}
    }
    console.log(_.get(applicant,'expected_ctc'))
    var expected_ctc_m =[1]
    var resApplicant = {
      id: applicant.id,
      name: applicant.name,
      email_id: _.get(applicant.Emails[0],'email'),
      number: _.get(applicant.PhoneNumbers[0],'number'),
      expected_ctc :  _.get(applicant,'expected_ctc'),
      employer_id: _.get(applicant.Experience,'employer_id'),
      designation_id: _.get(applicant.Experience,'designation_id'),
      degree_id: _.get(applicant.Education[0],'degree_id'),
      salary: _.get(applicant.Experience,'salary'),
      notice_period: _.get(applicant,'notice_period'),
      region_id: _.get(applicant.Experience,'region_id'),
      total_exp:   _.get(applicant,'total_exp'),

      // Derived Fields
      region: _.get(applicant.Experience,'region'),
      designation_name: _.get(applicant.Experience,'designation'),
      employer_name: _.get(applicant.Experience,'employer'),
      degree_name: _.get(applicant.Degree,'degree'),
      total_exp_y: Math.round(_.get(applicant,'total_exp')),
      total_exp_m: getExperienceMonth(_.get(applicant,'total_exp')),
        //
    }

    return res.json(resApplicant)
  }).catch(err => handleError(res,500,err))
}

export function update(req,res) {

  //slack("Quarc API: applicant create: jobId" + req.params.jobId + ", applicant id:" )
  //// parse a file upload Todo: file upload limit, extension
  db.Applicant.getFullDetails(db,req.params.applicantId).then(existingApplicant => {
    var promises = [];

    var reqPr = [];
    if(-1 == req.get('Content-Type').search('json')) {
      // Multipart
      reqPr = new Promise(
        function (resolve, reject) { // (A)
          var form = new formidable.IncomingForm();
          form.parse(req,function (err,fields,files) {
            if(err) return reject(err)
            return resolve({body:JSON.parse(fields.payload),files:files})
          })
        })
    } else  if(-1 == req.get('Content-Type').search('multipart')){
      // application/json
      reqPr = Promise.resolve({body:req.body})
    } else {
      return res.json({})
    }

    return Promise.all([reqPr]).then(function(bodyPrRe){

      var applicantData  = bodyPrRe[0]
      var files = applicantData.files
      let editedApplicant = applicantData.body
      if(editedApplicant.id){
        delete editedApplicant.id
      }

      let applicantId = req.params.applicantId;
      var promises = [];
      promises.push(db.Applicant.findById(existingApplicant.id).then(appl => appl.update(_.pick(editedApplicant,'name','expected_ctc','notice_period','total_exp'))))
      if(files){
        var file = files.fileUpload;
        let fileExtension = file.name.split(".").pop(); // Extension
        let allowedExtType = ['doc', 'docx', 'pdf', 'rtf', 'txt'];
        if (allowedExtType.indexOf(fileExtension.toLowerCase()) === -1) {
          return res.json({code: "400 Bad Request", message: "File Type Not Allowed"});
        }

        var resumePr = db.Resume.find({
          attributes: [
            'id',
            'applicant_id',
            'path'
          ],
          where: {
            applicant_id: applicantId
          }
        }).then(resume=> {
          if(!resume) return  {message:'Resume not found'}
          let existsingFilename = resume.path.split("/").pop();
          let newupdateIdArray = existsingFilename.split('.');
          let newID = parseInt(newupdateIdArray[0]) + 1;
          const applicantIdLowerRoundOff = (applicantId - (applicantId % 10000)).toString();

          let folder = path.join(config.QDMS_PATH, 'Applicants', applicantIdLowerRoundOff, applicantId.toString()) + "/";
          var resumePathToUpdateInDB =  folder + newID  + "."+fileExtension
          return db.Applicant.uploadFile(db, files.fileUpload.path, folder, newID, fileExtension, applicantId).then(converted => {
            const processApplicantCharactersticksPr = db.Applicant.processApplicantCharactersticks(db, applicantId, req.params.jobId).then(re => {
              console.log("Success:processApplicantCharactersticks,extractApplicant, updateScore, updateStates", applicantId, req.params.jobId)
            }).catch(err => {
              console.log("Success:processApplicantCharactersticks,extractApplicant, updateScore, updateStates", applicantId, req.params.jobId, err)
            });
            return resume.update({path:resumePathToUpdateInDB})
          });
        });
        promises.push(resumePr)
      }

      if(!!editedApplicant.email_id && _.get(existingApplicant.Emails[0],'email') !== editedApplicant.email_id ){
        promises.push(db.Email.findById(_.get(existingApplicant.Emails[0],'id')).then(email => email.update({email:editedApplicant.email_id})))
      }

      if(!!editedApplicant.number && _.get(existingApplicant.PhoneNumbers[0],'number') !== editedApplicant.number ){
        promises.push(db.PhoneNumber.findById(_.get(existingApplicant.PhoneNumbers[0],'id')).then(number => number.update({number:editedApplicant.number})))
      }

      if(!!editedApplicant.degree_id  && _.get(existingApplicant.Education[0],'id') !== editedApplicant.degree_id ){
        promises.push(db.Education.findById(_.get(existingApplicant.Education[0],'id')).then(education => education.update({degree_id:editedApplicant.degree_id})))
      }


      var experienceToSave = {}


      if(!!editedApplicant.salary && _.get(existingApplicant.Experience,'salary') != editedApplicant.salary) experienceToSave.salary = editedApplicant.salary
      if(!!editedApplicant.region_id && _.get(existingApplicant.Experience,'region_id') != editedApplicant.region_id ) experienceToSave.region_id = editedApplicant.region_id
      if(!!editedApplicant.employer_id && _.get(existingApplicant.Experience,'employer_id') != editedApplicant.employer_id ) experienceToSave.employer_id = editedApplicant.employer_id
      if(!!editedApplicant.designation_id && _.get(existingApplicant.Experience,'designation_id') != editedApplicant.designation_id) experienceToSave.designation_id = editedApplicant.designation_id

      if(Object.keys(experienceToSave).length){
        promises.push(db.Experience.findById(_.get(existingApplicant.Experience,'id'))
          .then(exp => exp.update(experienceToSave)))
      }

      return Promise.all(promises).then(prRe => {
        return res.json({id:existingApplicant.id})
      })

    })
  }).catch(err => handleError(res,500,err))
}

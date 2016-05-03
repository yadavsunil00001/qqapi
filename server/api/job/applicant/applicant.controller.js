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

// Creates a new Reference in the DB
export function create(req, res) {
  Reference.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(err => handleErr(res, 500, err));
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

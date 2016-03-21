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

// Check Already Applied
export function alreadyApplied(req, res) {
   Applicant.alreadyApplied(db,req.params.jobId,req.query.email,req.query.number)
    .then(status => {
      return res.json(_.extend({code: 409, message: "phone or email conflict"}, status))
    }).catch(err => handleError(res,500,err))
}

// Creates a new Applicant in the DB
export function create(req, res) {
  // parse a file upload Todo: file upload limit, extension
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if(err) return handleError(res,500,err);
    let applicant = JSON.parse(fields.payload);
    return Applicant.alreadyApplied(db, req.params.jobId, applicant.email_id, applicant.number)
      .then(status => {
        if (status.email === true || status.number === true) return res.status(409).json(_.extend({
          code: 409, message: "Already candidate uploaded with this Phone or Email"}, status))
        return Applicant.saveApplicant(db,applicant, files.fileUpload, req.user.id, req.params.jobId)
          .then(savedApplicant => res.json( _.pick(savedApplicant,['id'])))
      })
      .catch(err => handleError(res,500,err));
  });
}

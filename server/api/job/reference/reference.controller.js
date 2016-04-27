/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobs              ->  index
 * POST    /api/jobs              ->  create
 * GET     /api/jobs/:id          ->  show
 * PUT     /api/jobs/:id          ->  update
 * DELETE  /api/jobs/:id          ->  destroy
 */

'use strict';

import fs from 'fs';
import _ from 'lodash';
import db,{Reference, Applicant} from '../../../sqldb';
import config from '../../../config/environment';

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

// Gets a list of References
// cvReceived for a particular job id and for a particular con_id this
export function index(req, res) {
  // Approval Status
  // 0 -> Action Required 1 -> Approved 2 -> Reject 3 -> Duplicate
  Reference.findAll({where: {job_id: req.params.jobId, con_id: req.user.id}})
    .then(handleEntityNotFound(res))
    .then(function (refereneces) {
      res.json(refereneces)
    })
    .catch(err => handleError(res, 500, err));
}

// Gets a single Reference from the DB
export function show(req, res) {
  Reference.findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(err => handleErr(res, 500, err));
}

export function getResume(req, res) {
  Reference
    .findById(req.params.id)
    .then(function formatFile(resume) {
      fs.readFile(`${config.QDMS_PATH + "Welcome/" + (resume.id - (resume.id % 10000)) + '/' + resume.id + '/'}${resume.path}`, (err, resumeFile) => {
        if (err) return handleError(res, 500, err);
        res.contentType('application/pdf');
        res.send(resumeFile);
      });
    })
    .catch(err => handleError(res, 500, err));
};


// Creates a new Reference in the DB
export function create(req, res) {
  Reference.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(err => handleErr(res, 500, err));
}

export function accept(req, res) {
  var jobId = req.params.jobId;
  var referenceId = req.params.id;
  // 27 : Screening Pending 37 : Prescreen Failed
  var stateId = (req.body.approve == true) ? 27 : 37;

  Reference.findById(referenceId)
    .then(function (reference) {
      return db.Applicant.alreadyApplied(db, jobId, reference.email_id, reference.number)
        .then(status => {
          if (status.email === true || status.number === true) {
            var approval_status = 3;
            return reference.update({approval_status: approval_status})
              .then(reference => res.json({approval_status: reference.approval_status, message: 'Duplicate'}));
          }
          const userId = reference.con_id || req.user.id
          let file = {
            name: reference.path,
            path: config.QDMS_PATH + 'Welcome/' + (referenceId - (referenceId % 10000)) + "/" + referenceId + "/" + reference.path
          };
          return Promise.all([
            db.Employer.findOrCreate({where: {name: reference.employer}}),
            db.Designation.findOrCreate({where: {name: reference.designation}}),
            db.Degree.findOrCreate({where: {degree: reference.higest_qualification}}),
            db.Region.findOrCreate({where: {region: reference.location}})
          ]).then(promiseReturns => {
            const employer = promiseReturns[0][0]
            const designation = promiseReturns[1][0]
            const degree = promiseReturns[2][0]
            const region = promiseReturns[3][0]
            //console.log(region)
            let applicant = {
              name: reference.name,
              expected_ctc: reference.expected_salary,
              salary: reference.current_salary,
              notice_period: reference.notice_period,
              total_exp: reference.total_exp,

              number: reference.phone,
              email_id: reference.email,

              employer_id: employer.id, // TODO: Table restructure
              designation_id: designation.id,
              degree_id: degree.id,
              region_id: region.id,
            };

            return Applicant.saveApplicant(db, applicant, file, userId, jobId, stateId)
              .then(function (applicant) {
                var approval_status = 1;
                if (stateId == 27) { approval_status = 1; }
                if (stateId == 37) { approval_status = 2; }
                return  reference.update({approval_status: approval_status})
                .then(reference => res.json({
                  approval_status: reference.approval_status,
                  message: (approval_status==1) ? 'Approved': 'Reject',
                  id: applicant.id}));
              })
          })
        })
    })
    .catch(err => handleError(res, 500, err));
}

// Updates an existing Reference in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Reference.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(err => handleErr(res, 500, err));
}

// Deletes a Reference from the DB
export function destroy(req, res) {
  Reference.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(err => handleErr(res, 500, err));
}

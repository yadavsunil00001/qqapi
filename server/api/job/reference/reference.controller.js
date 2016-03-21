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
import {Reference, Applicant} from '../../../sqldb';
import config from '../../../config/environment';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode,err) {
  statusCode = statusCode || 500;
  res.status(statusCode).json(err);
}

// Gets a list of References
// cvReceived for a particular job id and for a particular con_id this
export function index(req, res) {
  // Approval Status
  // 0 -> Action Required
  // 1 -> Approved
  // 2 -> Reject
  // 3 -> Duplicate

  Reference.findAll({
      where: {
        job_id: req.params.jobId,
        con_id: req.user.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(function(refereneces){
      res.json(refereneces)
    })
    .catch(err => handleError(res,500,err));
}

// Gets a single Reference from the DB
export function show(req, res) {
  Reference.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(err => handleErr(res,500,err));
}

export function getResume(req, res) {
  Reference
    .find({
      //attributes: ['path'],
      where: { id: req.params.id},
    })
    .then(function formatFile(resume) {
      fs.readFile(`${config.QDMS_PATH + "Welcome/" +(resume.id - (resume.id % 10000))+'/'+resume.id+'/'}${resume.path}`, (err, resumeFile) => {
        if (err) return handleError(res, 500, err);
        res.contentType('application/pdf');
        res.send(resumeFile);
      });
    })
    .catch(err => handleError(res,500,err));
};


// Creates a new Reference in the DB
export function create(req, res) {
  Reference.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(err => handleErr(res,500,err));
}

export function accept(req, res) {
  // Approval Status  27 -> Status id is for Screening Pending, 37 -> Status id is for pre-screening Reject
  var jobId = req.params.jobId;
  var referenceId = req.params.id;
  var stateId = (req.body.approve == true) ? 27: 37;

  // Fetching details from welcome table for a particular id
  Reference.find({
      where: {
        id: referenceId
      }
    })
    .then(function(reference){
      let referenceId = reference.id;
      let referenceResume = {
        name : reference.path,
        path : config.QDMS_PATH+ 'Welcome/' + (referenceId - (referenceId % 10000)) + "/" + referenceId + "/" + reference.path
      };

      console.log(referenceResumePath)

      let applicant = {
        name: reference.name,
        total_exp: reference.total_exp,
        expected_ctc: reference.expected_salary,
        notice_period: reference.notice_period,
        state_id: stateId,
        employer_id: reference.employer, // TODO
        designation_id: reference.designation, // TODO  elite
        region_id: reference.location, // TODO
        degree_id: reference.higest_qualification,
        salary: reference.current_salary,
        user_id: reference.con_id,
        number: reference.phone,
        email_id: reference.email,
        fileUpload: referenceResume,
        jobId:jobId,
      };

      return Applicant.saveApplicant(applicant, stateId).then(function(result){
        var approval_status = 1;
        if( stateId == 27 ){
          approval_status = 1;
          Reference.update({
            approval_status: approval_status
          }, {
            where: {
              id : referenceId
            }
          }).then(function() {
            return res.json({
              approval_status : approval_status,
              message: 'Approved',
              id: result.id
            });
          });
        }else  if( stateId == 37 ){
          approval_status = 2;
          Reference.update({
            approval_status: approval_status
          }, {
            where: {
              id : referenceId
            }
          }).then(function() {
            return res.json({
              approval_status : approval_status,
              message: 'Reject',
              id: result.id
            });
          });
        }else{
          return res.json({
            code: 409,
            message: "Error Ocourred while action."
          })
        }
      }).catch(function(err){
        return res.json (err);
        // Updating approval status to duplicate
        // 1 => approved
        // 2 => reject
        // 3 => duplicate
        var approval_status = 3;
        Reference.update({
          approval_status: approval_status
        }, {
          where: {
            id : referenceId
          }
        }).then(function() {
          return res.json({
            code: 409,
            approval_status : 3,
            message: 'Duplicate'
          });
        });
      });
    })
    .catch(err => handleError(res,500,err));
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
    .catch(err => handleErr(res,500,err));
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
    .catch(err => handleErr(res,500,err));
}

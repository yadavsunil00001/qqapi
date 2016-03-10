/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/welcomes              ->  index
 * POST    /api/welcomes              ->  create
 * GET     /api/welcomes/:id          ->  show
 * PUT     /api/welcomes/:id          ->  update
 * DELETE  /api/welcomes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Welcome} from '../../sqldb';
import config from './../../config/environment';
import {saveApplicant} from '../../api/job/applicant/applicant.controller';

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

function handleError(res, statusCode, err) {
  statusCode = statusCode || 500;

    console.log(err);
    res.status(statusCode).send(err);
  
}

// Gets a list of Welcomes
export function index(req, res) {
  Welcome.findAll()
    .then(respondWithResult(res))
    .catch(err => handleError(res,500,err));
}

// Gets a single Welcome from the DB
export function show(req, res) {
  Welcome.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(err => handleError(res,500,err));
}

// Creates a new Welcome in the DB
export function create(req, res) {
  Welcome.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(err => handleError(res,500,err));
}

// Updates an existing Welcome in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Welcome.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(err => handleError(res,500,err));
}

// Deletes a Welcome from the DB
export function destroy(req, res) {
  Welcome.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(err => handleError(res,500,err));
}

// cvReceived for a particular job id and for a particular con_id this

export function cvReceived(req, res) {
  // Approval Status
  // 1 -> Approved
  // 2 -> Reject
  // 3 -> Duplicate
    Welcome.findAll({
      where: {
        job_id: req.params.jobId,
        con_id: req.user.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(err => handleError(res,500,err));
}

export function preScreenedView(req, res) {
  // Approval Status
  // 1 -> Approved
  // 2 -> Reject
  // 3 -> Duplicate
  Welcome.find({
      where: {
        id: req.params.id,
        con_id: req.user.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(err => handleError(res,500,err));
}

// Create applicant from social shared cv stored in welcome table
// firstly fetch the particular record from welcome table then send request to applicant save to create applicant


export function createApplicant(req, res) {
  // Approval Status  27 -> Status id is for Screening Pending, 37 -> Status id is for pre-screening Reject
  var welcomeId = req.params.id;
  var stateId = req.body.stateId;
  var jobId = req.params.jobId;
  // Fetching details from welcome table for a particular id
    Welcome.find({
        where: {
          id: welcomeId
        }
    })
    .then(function(welcomeData){
      let welcomeId = welcomeData.id;
      let welcomePath = welcomeData.path;
      let welcomeIdPath = config.QDMS_PATH_WELCOME + (welcomeId - (welcomeId % 10000)) + "/" + welcomeId + "/" + welcomePath ;
      //let welcomeIdPath = "C:/home/gloryque/QDMS/Welcome/0/2193/You_Too_Can_Run_Neon_Run.pdf" ;

      // creating required array to be posted
      let applicantData = {
        "name": welcomeData.name,
        "total_exp": welcomeData.total_exp,
        "expected_ctc": welcomeData.expected_salary,
        "notice_period": welcomeData.notice_period,
        "state_id": stateId,
        "employer_id": welcomeData.employer, // TODO
        "designation_id": welcomeData.designation, // TODO  elite
        "region_id": welcomeData.location, // TODO
        "degree_id": welcomeData.higest_qualification,
        "salary": welcomeData.current_salary,
        "user_id": welcomeData.con_id,
        "number": welcomeData.phone,
        "email_id": welcomeData.email,
      };
      applicantData.fileUpload = { name : welcomeData.path, path : welcomeIdPath};
      applicantData.jobId = jobId;
      //console.log(applicantData.fileUpload.name);
      return saveApplicant(applicantData, stateId).then(function(result){
        var approval_status = 1;
        if( stateId == 27 ){
          approval_status = 1;
          Welcome.update({
            approval_status: approval_status
          }, {
            where: {
              id : welcomeId
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
          Welcome.update({
            approval_status: approval_status
          }, {
            where: {
              id : welcomeId
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
        Welcome.update({
          approval_status: approval_status
        }, {
          where: {
            id : welcomeId
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
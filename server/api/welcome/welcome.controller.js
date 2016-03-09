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
  // Approval Status
  // 27 -> Status id is for Screening Pending
  // 37 -> Status id is for pre-screening Reject
  var stateId = req.body.stateId;
  stateId = 27;
  var jobId = req.params.jobId;
  jobId = 1110;
    Welcome.find({
        where: {
          id: req.params.id,
          //con_id: req.user.id
        }
    })
    .then(function(result){
      let welcomeId = result.id;
      let welcomePath = result.path;
      //let welcomeIdPath = config.QDMS_PATH_WELCOME + (welcomeId - (welcomeId % 10000)) + "/" + welcomeId + "/" + welcomePath ;
      let welcomeIdPath = "C:/home/gloryque/QDMS/Welcome/0/2193/You_Too_Can_Run_Neon_Run.pdf" ;
      //return res.json(welcomeIdPath);


      let applicantData = {"name": "TESTING DHRUV",
        "total_exp": 4,
        "expected_ctc": 12,
        "notice_period": 2,
        "quezx_id": null,
        "status": 1,
        "verified": 1,
        "score": 37,
        "created_by": 201,
        "created_at": "2015-05-20T13:37:32.000Z",
        "updated_by": null,
        "updated_on": "2015-10-23T05:09:40.000Z",
        "parent_id": null,
        "state_id": 26,
        "screening_state_id": 1,
        "applicant_screening_id": null,
        "scheduled_on": null,
        "employer_id": 11,
        "designation_id": 12,
        "region_id": 33,
        "salary": 11,
        "user_id": 14,
        "number": 80222221111,
        "email_id": "d3am2ajesh211@quetzal.in"};

      applicantData.fileUpload = { name : result.path, path : welcomeIdPath};
      applicantData.jobId = jobId;
      console.log(applicantData.fileUpload.name)
      return saveApplicant(applicantData, stateId).then(function(result){
        return res.json(result);
      }).catch(function(err){
        console.log(err);
        return res.json(err);
      });
      let dataArray = result;
      console.log(dataArray.id);
    })
    .catch(err => handleError(res,500,err));
}
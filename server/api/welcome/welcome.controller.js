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

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Welcomes
export function index(req, res) {
  Welcome.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
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
    .catch(handleError(res));
}

// Creates a new Welcome in the DB
export function create(req, res) {
  Welcome.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
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
    .catch(handleError(res));
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
    .catch(handleError(res));
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
    .catch(handleError(res));
}

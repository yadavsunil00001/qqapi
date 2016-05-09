/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobApplications              ->  index
 * POST    /api/jobApplications              ->  create
 * GET     /api/jobApplications/:id          ->  show
 * PUT     /api/jobApplications/:id          ->  update
 * DELETE  /api/jobApplications/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { JobApplication } from '../../sqldb';

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

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of JobApplications
export function index(req, res) {
  JobApplication.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single JobApplication from the DB
export function show(req, res) {
  JobApplication.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new JobApplication in the DB
export function create(req, res) {
  JobApplication.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing JobApplication in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  JobApplication.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a JobApplication from the DB
export function destroy(req, res) {
  JobApplication.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

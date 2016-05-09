/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/educations              ->  index
 * POST    /api/educations              ->  create
 * GET     /api/educations/:id          ->  show
 * PUT     /api/educations/:id          ->  update
 * DELETE  /api/educations/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { Education } from '../../sqldb';

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

// Gets a list of Educations
export function index(req, res) {
  Education.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Education from the DB
export function show(req, res) {
  Education.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Education in the DB
export function create(req, res) {
  Education.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Education in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Education.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Education from the DB
export function destroy(req, res) {
  Education.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

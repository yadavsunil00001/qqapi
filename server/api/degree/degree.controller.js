/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/degrees              ->  index
 * POST    /api/degrees              ->  create
 * GET     /api/degrees/:id          ->  show
 * PUT     /api/degrees/:id          ->  update
 * DELETE  /api/degrees/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Degree} from '../../sqldb';

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

// Gets a list of Degrees
export function index(req, res) {
  Degree.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Degree from the DB
export function show(req, res) {
  Degree.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Degree in the DB
export function create(req, res) {
  Degree.build(req.body)
    .set('verified', 0)
    .set('system_defined', 1)
    .set('timestamp', Date.now())
    .save()
    .then(degree => res.status(201).json(_.pick(degree, ['id', 'degree'])))
    .catch(handleError(res));
}

// Updates an existing Degree in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Degree.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Degree from the DB
export function destroy(req, res) {
  Degree.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

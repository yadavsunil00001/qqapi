/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/industries              ->  index
 * POST    /api/industries              ->  create
 * GET     /api/industries/:id          ->  show
 * PUT     /api/industries/:id          ->  update
 * DELETE  /api/industries/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Industry} from '../../sqldb';

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

// Gets a list of Industrys
export function index(req, res) {
  Industry.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Industry from the DB
export function show(req, res) {
  Industry.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Industry in the DB
export function create(req, res) {
  Industry.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Industry in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Industry.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Industry from the DB
export function destroy(req, res) {
  Industry.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/screeningStates              ->  index
 * POST    /api/screeningStates              ->  create
 * GET     /api/screeningStates/:id          ->  show
 * PUT     /api/screeningStates/:id          ->  update
 * DELETE  /api/screeningStates/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {ScreeningState} from '../../sqldb';

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

// Gets a list of ScreeningStates
export function index(req, res) {
  ScreeningState.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ScreeningState from the DB
export function show(req, res) {
  ScreeningState.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ScreeningState in the DB
export function create(req, res) {
  ScreeningState.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ScreeningState in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ScreeningState.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ScreeningState from the DB
export function destroy(req, res) {
  ScreeningState.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

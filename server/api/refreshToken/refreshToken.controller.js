/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/refreshTokens              ->  index
 * POST    /api/refreshTokens              ->  create
 * GET     /api/refreshTokens/:id          ->  show
 * PUT     /api/refreshTokens/:id          ->  update
 * DELETE  /api/refreshTokens/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {RefreshToken} from '../../sqldb';

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

// Gets a list of RefreshTokens
export function index(req, res) {
  RefreshToken.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single RefreshToken from the DB
export function show(req, res) {
  RefreshToken.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new RefreshToken in the DB
export function create(req, res) {
  RefreshToken.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing RefreshToken in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  RefreshToken.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a RefreshToken from the DB
export function destroy(req, res) {
  RefreshToken.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

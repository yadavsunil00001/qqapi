/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/userTawktoTokens              ->  index
 * POST    /api/userTawktoTokens              ->  create
 * GET     /api/userTawktoTokens/:id          ->  show
 * PUT     /api/userTawktoTokens/:id          ->  update
 * DELETE  /api/userTawktoTokens/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { UserTawktoToken } from '../../sqldb';

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

// Gets a list of UserTawktoTokens
export function index(req, res) {
  UserTawktoToken.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single UserTawktoToken from the DB
export function show(req, res) {
  UserTawktoToken.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new UserTawktoToken in the DB
export function create(req, res) {
  UserTawktoToken.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing UserTawktoToken in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  UserTawktoToken.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a UserTawktoToken from the DB
export function destroy(req, res) {
  UserTawktoToken.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

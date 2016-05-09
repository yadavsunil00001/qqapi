/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/authCodes              ->  index
 * POST    /api/authCodes              ->  create
 * GET     /api/authCodes/:id          ->  show
 * PUT     /api/authCodes/:id          ->  update
 * DELETE  /api/authCodes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { AuthCode } from '../../sqldb';

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

// Gets a list of AuthCodes
export function index(req, res) {
  AuthCode.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single AuthCode from the DB
export function show(req, res) {
  AuthCode.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new AuthCode in the DB
export function create(req, res) {
  AuthCode.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing AuthCode in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  AuthCode.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a AuthCode from the DB
export function destroy(req, res) {
  AuthCode.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

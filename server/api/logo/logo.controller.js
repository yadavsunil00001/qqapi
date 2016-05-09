/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/logos              ->  index
 * POST    /api/logos              ->  create
 * GET     /api/logos/:id          ->  show
 * PUT     /api/logos/:id          ->  update
 * DELETE  /api/logos/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { Logo } from '../../sqldb';

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

// Gets a list of Logos
export function index(req, res) {
  Logo.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Logo from the DB
export function show(req, res) {
  Logo.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Logo in the DB
export function create(req, res) {
  Logo.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Logo in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Logo.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Logo from the DB
export function destroy(req, res) {
  Logo.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

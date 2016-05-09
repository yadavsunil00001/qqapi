/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/phoneNumbers              ->  index
 * POST    /api/phoneNumbers              ->  create
 * GET     /api/phoneNumbers/:id          ->  show
 * PUT     /api/phoneNumbers/:id          ->  update
 * DELETE  /api/phoneNumbers/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { PhoneNumber } from '../../sqldb';

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

// Gets a list of PhoneNumbers
export function index(req, res) {
  PhoneNumber.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single PhoneNumber from the DB
export function show(req, res) {
  PhoneNumber.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new PhoneNumber in the DB
export function create(req, res) {
  PhoneNumber.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing PhoneNumber in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  PhoneNumber.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a PhoneNumber from the DB
export function destroy(req, res) {
  PhoneNumber.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

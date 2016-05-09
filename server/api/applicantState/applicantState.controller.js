/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applicantStates              ->  index
 * POST    /api/applicantStates              ->  create
 * GET     /api/applicantStates/:id          ->  show
 * PUT     /api/applicantStates/:id          ->  update
 * DELETE  /api/applicantStates/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { ApplicantState } from '../../sqldb';

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

// Gets a list of ApplicantStates
export function index(req, res) {
  ApplicantState.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ApplicantState from the DB
export function show(req, res) {
  ApplicantState.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ApplicantState in the DB
export function create(req, res) {
  ApplicantState.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ApplicantState in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ApplicantState.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ApplicantState from the DB
export function destroy(req, res) {
  ApplicantState.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

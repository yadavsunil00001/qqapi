/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applicantViews              ->  index
 * POST    /api/applicantViews              ->  create
 * GET     /api/applicantViews/:id          ->  show
 * PUT     /api/applicantViews/:id          ->  update
 * DELETE  /api/applicantViews/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {ApplicantView} from '../../sqldb';

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

// Gets a list of ApplicantViews
export function index(req, res) {
  ApplicantView.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ApplicantView from the DB
export function show(req, res) {
  ApplicantView.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ApplicantView in the DB
export function create(req, res) {
  ApplicantView.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ApplicantView in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ApplicantView.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ApplicantView from the DB
export function destroy(req, res) {
  ApplicantView.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

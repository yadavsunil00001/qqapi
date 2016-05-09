/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobsIndustries              ->  index
 * POST    /api/jobsIndustries              ->  create
 * GET     /api/jobsIndustries/:id          ->  show
 * PUT     /api/jobsIndustries/:id          ->  update
 * DELETE  /api/jobsIndustries/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { JobsIndustry } from '../../sqldb';

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

// Gets a list of JobsIndustrys
export function index(req, res) {
  JobsIndustry.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single JobsIndustry from the DB
export function show(req, res) {
  JobsIndustry.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new JobsIndustry in the DB
export function create(req, res) {
  JobsIndustry.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing JobsIndustry in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  JobsIndustry.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a JobsIndustry from the DB
export function destroy(req, res) {
  JobsIndustry.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

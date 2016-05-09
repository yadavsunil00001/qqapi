/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/designations              ->  index
 * POST    /api/designations              ->  create
 * GET     /api/designations/:id          ->  show
 * PUT     /api/designations/:id          ->  update
 * DELETE  /api/designations/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { Designation } from '../../sqldb';
import sequelize from 'sequelize';
import { handleUniqueValidationError } from '../../components/sequelize-errors';

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

function handleError(res, statusCode, err) {
  statusCode = statusCode || 500;
  res.status(statusCode).send(err);
}

// Gets a list of Designations
export function index(req, res) {
  Designation.findAll()
    .then(respondWithResult(res))
    .catch(err => handleError(res, 500, err));
}

// Gets a single Designation from the DB
export function show(req, res) {
  Designation.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(err => handleError(res, 500, err));
}

// Creates a new Designation in the DB
export function create(req, res) {
  if (req.body.name) {
    Designation.build(req.body)
      .set('verified', 0)
      .set('timestamp', Date.now())
      .save()
      .then(designation => res.status(201).json(_.pick(designation, ['id', 'name'])))
      .catch(sequelize.ValidationError, handleUniqueValidationError(Designation, { name: req.body.name }))
      .catch(function (err) {
        return err.data ? res.status(409).json(_.pick(err.data, ['id', 'name'])) : handleError(res, 400, err);
      });
  } else {
    handleError(res, 400, { message:'param "name" missing in request body' });
  }
}

// Updates an existing Designation in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Designation.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(err => handleError(res, 500, err));
}

// Deletes a Designation from the DB
export function destroy(req, res) {
  Designation.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(err => handleError(res, 500, err));
}

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/degrees              ->  index
 * POST    /api/degrees              ->  create
 * GET     /api/degrees/:id          ->  show
 * PUT     /api/degrees/:id          ->  update
 * DELETE  /api/degrees/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { Degree } from '../../sqldb';
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
  console.log('handleError', err);
  statusCode = statusCode || 500;
  res.status(statusCode).send(err);
}

// Gets a list of Degrees
export function index(req, res) {
  Degree.findAll()
    .then(respondWithResult(res))
    .catch(err => handleError(res, 500, err));
}

// Gets a single Degree from the DB
export function show(req, res) {
  Degree.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(err => handleError(res, 500, err));
}

// Creates a new Degree in the DB
export function create(req, res) {
  // Todo: Request Middleware: Refactor Table Degree.degree to Degree.name
  req.body.degree = req.body.name;
  Degree.build(req.body)
    .set('verified', 0)
    .set('system_defined', 1)
    .set('timestamp', Date.now())
    .save()
    .then(degree => {
      degree = _.pick(degree, ['id', 'degree']);
      // Todo: Response Middleware: Refactor Table Degree.degree to Degree.name
      degree.name = degree.degree;
      res.status(201).json(degree);
    })
    .catch(sequelize.ValidationError, handleUniqueValidationError(Degree, { degree: req.body.degree }))
    .catch(function (err) {
      // Todo: Response Middleware: Refactor Table Degree.degree to Degree.name
      err.data = _.pick(err.data, ['id', 'degree']);
      err.data.name = err.data.degree;
      return err.data ? res.status(409).json(err.data) : handleError(res, 400, err);
    });
}

// Updates an existing Degree in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Degree.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(err => handleError(res, 500, err));
}

// Deletes a Degree from the DB
export function destroy(req, res) {
  Degree.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(err => handleError(res, 500, err));
}

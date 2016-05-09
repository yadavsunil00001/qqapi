/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/institutes              ->  index
 * POST    /api/institutes              ->  create
 * GET     /api/institutes/:id          ->  show
 * PUT     /api/institutes/:id          ->  update
 * DELETE  /api/institutes/:id          ->  destroy
 */



import _ from 'lodash';
import { Institute } from '../../sqldb';

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

// Gets a list of Institutes
export function index(req, res) {
  Institute.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Institute from the DB
export function show(req, res) {
  Institute.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Institute in the DB
export function create(req, res) {
  Institute.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Institute in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Institute.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Institute from the DB
export function destroy(req, res) {
  Institute.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

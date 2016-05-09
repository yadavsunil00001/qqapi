/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/consultantResponses              ->  index
 * POST    /api/consultantResponses              ->  create
 * GET     /api/consultantResponses/:id          ->  show
 * PUT     /api/consultantResponses/:id          ->  update
 * DELETE  /api/consultantResponses/:id          ->  destroy
 */



import _ from 'lodash';
import { ConsultantResponse } from '../../sqldb';

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

// Gets a list of ConsultantResponses
export function index(req, res) {
  ConsultantResponse.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ConsultantResponse from the DB
export function show(req, res) {
  ConsultantResponse.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ConsultantResponse in the DB
export function create(req, res) {
  ConsultantResponse.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ConsultantResponse in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ConsultantResponse.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ConsultantResponse from the DB
export function destroy(req, res) {
  ConsultantResponse.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

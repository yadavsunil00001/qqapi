/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/clientPaymentMaps              ->  index
 * POST    /api/clientPaymentMaps              ->  create
 * GET     /api/clientPaymentMaps/:id          ->  show
 * PUT     /api/clientPaymentMaps/:id          ->  update
 * DELETE  /api/clientPaymentMaps/:id          ->  destroy
 */



import _ from 'lodash';
import { ClientPaymentMap } from '../../sqldb';

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

// Gets a list of ClientPaymentMaps
export function index(req, res) {
  ClientPaymentMap.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ClientPaymentMap from the DB
export function show(req, res) {
  ClientPaymentMap.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ClientPaymentMap in the DB
export function create(req, res) {
  ClientPaymentMap.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ClientPaymentMap in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ClientPaymentMap.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ClientPaymentMap from the DB
export function destroy(req, res) {
  ClientPaymentMap.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

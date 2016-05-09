/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/logs              ->  index
 * POST    /api/logs              ->  create
 * GET     /api/logs/:id          ->  show
 * PUT     /api/logs/:id          ->  update
 * DELETE  /api/logs/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { Log } from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      if (entity.length && entity instanceof Array) {
        if (entity[0].name === 'stacktrace.js') {
          entity.map(function (item) {
            if (item.info) {
              try {
                item.info = (JSON.parse(item.info));
                item.createdAt = new Date(item.createdAt).toString();
                item.updatedAt = new Date(item.updatedAt).toString();
              } catch (e) {
                return item;
              }

            }
            return entity;
          });
        }
      }
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
    console.log(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Logs
export function index(req, res) {
  Log.findAll({
    order: '_id Desc',
    raw:true,
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Log from the DB
export function show(req, res) {
  Log.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Log in the DB
export function create(req, res) {
  Log.create({ name:'stacktrace.js', info:JSON.stringify(req.body) })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Log in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Log.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Log from the DB
export function destroy(req, res) {
  Log.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

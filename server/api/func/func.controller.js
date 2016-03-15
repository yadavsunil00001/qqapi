/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/funcs              ->  index
 * POST    /api/funcs              ->  create
 * GET     /api/funcs/:id          ->  show
 * PUT     /api/funcs/:id          ->  update
 * DELETE  /api/funcs/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Func} from '../../sqldb';

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

// Gets a list of Funcs
export function index(req, res) {
  Func.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Func from the DB
export function show(req, res) {
  Func.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Func in the DB
export function create(req, res) {
  Func.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Func in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Func.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Func from the DB
export function destroy(req, res) {
  Func.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Get Function List with  System_defined = 1
export function getFunctionList(req, res){
  Func.findAll({
      where: {
        system_defined: 1
      }
    }
  )
  .then(response => {
    return res.json({response});
  })
  .catch(function(err){
    return res.json({err});
  });
}
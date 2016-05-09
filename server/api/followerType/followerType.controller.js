/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/followerTypes              ->  index
 * POST    /api/followerTypes              ->  create
 * GET     /api/followerTypes/:id          ->  show
 * PUT     /api/followerTypes/:id          ->  update
 * DELETE  /api/followerTypes/:id          ->  destroy
 */



import _ from 'lodash';
import { FollowerType } from '../../sqldb';

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

// Gets a list of FollowerTypes
export function index(req, res) {
  FollowerType.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single FollowerType from the DB
export function show(req, res) {
  FollowerType.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new FollowerType in the DB
export function create(req, res) {
  FollowerType.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing FollowerType in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  FollowerType.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a FollowerType from the DB
export function destroy(req, res) {
  FollowerType.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

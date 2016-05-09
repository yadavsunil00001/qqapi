/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobs              ->  index
 * POST    /api/jobs              ->  create
 * GET     /api/jobs/:id          ->  show
 * PUT     /api/jobs/:id          ->  update
 * DELETE  /api/jobs/:id          ->  destroy
 */



import _ from 'lodash';
import { Reference } from '../../sqldb';

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

// Gets a list of References
export function index(req, res) {
  // Approval Status
  // 0 -> Action Required 1 -> Approved 2 -> Reject 3 -> Duplicate
  Reference.findAll({ where: { con_id: req.user.id } })
    .then(handleEntityNotFound(res))
    .then(refereneces => res.json(refereneces))
    .catch(err => handleError(res, 500, err));
}

// Gets a single Reference from the DB
export function show(req, res) {
  Reference.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(err => handleError(res, 500, err));
}

// Creates a new Reference in the DB
export function create(req, res) {
  Reference.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(err => handleError(res, 500, err));
}

// Updates an existing Reference in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Reference.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(err => handleError(res, 500, err));
}

// Deletes a Reference from the DB
export function destroy(req, res) {
  Reference.find({
    where: {
      id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(err => handleError(res, 500, err));
}

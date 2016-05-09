/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobsEmployers              ->  index
 * POST    /api/jobsEmployers              ->  create
 * GET     /api/jobsEmployers/:id          ->  show
 * PUT     /api/jobsEmployers/:id          ->  update
 * DELETE  /api/jobsEmployers/:id          ->  destroy
 */



import _ from 'lodash';
import { JobsEmployer } from '../../sqldb';

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

// Gets a list of JobsEmployers
export function index(req, res) {
  JobsEmployer.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single JobsEmployer from the DB
export function show(req, res) {
  JobsEmployer.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new JobsEmployer in the DB
export function create(req, res) {
  JobsEmployer.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing JobsEmployer in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  JobsEmployer.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a JobsEmployer from the DB
export function destroy(req, res) {
  JobsEmployer.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applicantPreferenceTimes              ->  index
 * POST    /api/applicantPreferenceTimes              ->  create
 * GET     /api/applicantPreferenceTimes/:id          ->  show
 * PUT     /api/applicantPreferenceTimes/:id          ->  update
 * DELETE  /api/applicantPreferenceTimes/:id          ->  destroy
 */



import _ from 'lodash';
import { ApplicantPreferenceTime } from '../../sqldb';

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

// Gets a list of ApplicantPreferenceTimes
export function index(req, res) {
  ApplicantPreferenceTime.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ApplicantPreferenceTime from the DB
export function show(req, res) {
  ApplicantPreferenceTime.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ApplicantPreferenceTime in the DB
export function create(req, res) {
  ApplicantPreferenceTime.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ApplicantPreferenceTime in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ApplicantPreferenceTime.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ApplicantPreferenceTime from the DB
export function destroy(req, res) {
  ApplicantPreferenceTime.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

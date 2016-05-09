/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applicantSkills              ->  index
 * POST    /api/applicantSkills              ->  create
 * GET     /api/applicantSkills/:id          ->  show
 * PUT     /api/applicantSkills/:id          ->  update
 * DELETE  /api/applicantSkills/:id          ->  destroy
 */



import _ from 'lodash';
import { ApplicantSkill } from '../../sqldb';

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

// Gets a list of ApplicantSkills
export function index(req, res) {
  ApplicantSkill.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ApplicantSkill from the DB
export function show(req, res) {
  ApplicantSkill.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ApplicantSkill in the DB
export function create(req, res) {
  ApplicantSkill.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ApplicantSkill in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ApplicantSkill.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ApplicantSkill from the DB
export function destroy(req, res) {
  ApplicantSkill.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/comments              ->  index
 * POST    /api/comments              ->  create
 * GET     /api/comments/:id          ->  show
 * PUT     /api/comments/:id          ->  update
 * DELETE  /api/comments/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {JobComment,ApplicantState, User} from '../../../sqldb';
import buckets from './../../../config/buckets';
import stakeholders from './../../../config/stakeholders';

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
    console.log("errr")
    res.status(statusCode).send(err);
  };
}

// Gets a list of Comments
export function index(req, res) {
  JobComment
    .findAll({
      attributes: ['id', ['comment', 'body'], 'user_id', ['timestamp', 'created_at']],
      order: [['id', 'DESC']],
      where: { job_id: req.params.jobId },
    })
    .then(function mergeUser(commentModels) {
      const comments = commentModels.map(s => s.toJSON());
      return User.findAll({
          attributes: ['id', 'name'],
          where: { id: comments.map(c => c.user_id) },
        })
        .then(function success(userModels) {
          comments.forEach(function attachUser(comment, index) {
            comments[index].user = userModels
              .filter(u => u.id === comments[index].user_id)[0];
          });

          return res.json(comments.map(s => _.pick(s, ['id', 'body', 'user', 'created_at'])));
        })
        .catch(handleError(res));
    })
    .catch(handleError(res));
};

// Creates a new Comment in the DB
export function create(req, res) {
  JobComment
    .build(req.body)
    .set('job_id', req.params.jobId)
    .set('user_id', req.user.id)
    .save()
    .then(c => res.status(201).json(_.pick(c, ['id', 'status'])))
    .catch(handleError(res));
};

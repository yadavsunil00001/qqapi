/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/comments              ->  index
 * POST    /api/comments              ->  create
 * GET     /api/comments/:id          ->  show
 * PUT     /api/comments/:id          ->  update
 * DELETE  /api/comments/:id          ->  destroy
 */

import _ from 'lodash';
import { JobComment, User } from '../../../sqldb';

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

// Gets a list of Comments
export function index(req, res) {
  JobComment
    .findAll({
      attributes: ['id', ['comment', 'body'], 'user_id', ['timestamp', 'created_at']],
      order: [['id', 'DESC']],
      where: { job_id: req.params.jobId },
    })
    .then((commentModels) => {
      const comments = commentModels.map(s => s.toJSON());
      return User.findAll({
        attributes: ['id', 'name'],
        where: { id: comments.map(c => c.user_id) },
      })
      .then(userModels => {
        comments.forEach((comment, iIndex) => {
          comments[iIndex].user = userModels
            .filter(u => u.id === comments[iIndex].user_id)[0];
        });

        return res.json(comments.map(s => _.pick(s, ['id', 'body', 'user', 'created_at'])));
      });
    })
    .catch(err => handleError(res, 500, err));
}

// Creates a new Comment in the DB
export function create(req, res) {
  JobComment
    .build(req.body)
    .set('job_id', req.params.jobId)
    .set('user_id', req.user.id)
    .save()
    .then(c => res.status(201).json(_.pick(c, ['id', 'status'])))
    .catch(err => handleError(res, 500, err));
}

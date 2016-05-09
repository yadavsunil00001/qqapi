/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/designations              ->  index
 * POST    /api/designations              ->  create
 * GET     /api/designations/:id          ->  show
 * PUT     /api/designations/:id          ->  update
 * DELETE  /api/designations/:id          ->  destroy
 */

import _ from 'lodash';
import { Designation } from '../../sqldb';
import sequelize from 'sequelize';
import { handleUniqueValidationError } from '../../components/sequelize-errors';

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

// Creates a new Designation in the DB
export function create(req, res) {
  if (req.body.name) {
    Designation.build(req.body)
      .set('verified', 0)
      .set('timestamp', Date.now())
      .save()
      .then(designation => res.status(201).json(_.pick(designation, ['id', 'name'])))
      .catch(sequelize.ValidationError,
        handleUniqueValidationError(Designation, { name: req.body.name }))
      .catch(err => {
        if (err.data) {
          return res.status(409).json(_.pick(err.data, ['id', 'name']));
        }
        return handleError(res, 400, err);
      });
  } else {
    handleError(res, 400, { message: 'param "name" missing in request body' });
  }
}

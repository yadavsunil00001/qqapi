/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/degrees              ->  index
 * POST    /api/degrees              ->  create
 * GET     /api/degrees/:id          ->  show
 * PUT     /api/degrees/:id          ->  update
 * DELETE  /api/degrees/:id          ->  destroy
 */

import _ from 'lodash';
import { Degree } from '../../sqldb';
import sequelize from 'sequelize';
import { handleUniqueValidationError } from '../../components/sequelize-errors';


function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

// Creates a new Degree in the DB
export function create(req, res) {
  // Todo: Request Middleware: Refactor Table Degree.degree to Degree.name
  const argBody = req.body;
  argBody.degree = req.body.name;
  Degree.build(argBody)
    .set('verified', 0)
    .set('system_defined', 1)
    .set('timestamp', Date.now())
    .save()
    .then(argDegree => {
      const degree = _.pick(argDegree, ['id', 'degree']);
      // Todo: Response Middleware: Refactor Table Degree.degree to Degree.name
      degree.name = degree.degree;
      res.status(201).json(degree);
    })
    .catch(sequelize.ValidationError,
      handleUniqueValidationError(Degree, { degree: req.body.degree }))
    .catch((argErr) => {
      const err = argErr;
      // Todo: Response Middleware: Refactor Table Degree.degree to Degree.name
      err.data = _.pick(err.data, ['id', 'degree']);
      err.data.name = err.data.degree;
      return err.data ? res.status(409).json(err.data) : handleError(res, 400, err);
    });
}

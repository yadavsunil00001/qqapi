/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/employers              ->  index
 * POST    /api/employers              ->  create
 * GET     /api/employers/:id          ->  show
 * PUT     /api/employers/:id          ->  update
 * DELETE  /api/employers/:id          ->  destroy
 */

import _ from 'lodash';
import { Employer } from '../../sqldb';
import sequelize from 'sequelize';
import { handleUniqueValidationError } from '../../components/sequelize-errors';

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

// Creates a new Employer in the DB
export function create(req, res) {
  if (req.body.name) {
    // Todo: DB Not handle Unique
    Employer.find({ where: { name: req.body.name } })
      .then(employer => {
        let promise = [];
        if (!employer) {
          promise = Employer.build(req.body)
            .set('is_customer', 0)
            .set('employer_type_id', 0)
            .set('verified', 0)
            .set('timestamp', Date.now())
            .set('system_defined', 1)
            .save()
            .then(bEmployer => {
              const temp = _.pick(bEmployer, ['id', 'name']);
              temp.status = 200;
              return temp;
            });
        } else {
          const temp = _.pick(employer, ['id', 'name']);
          temp.status = 409;
          promise = Promise.resolve(temp);
        }
        return Promise.all([promise]).then(prRe => res.status(prRe[0].status).json(prRe[0]));
      }).catch(sequelize.ValidationError,
      handleUniqueValidationError(Employer, { name: req.body.name }))
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

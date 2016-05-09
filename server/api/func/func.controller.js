/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/funcs              ->  index
 * POST    /api/funcs              ->  create
 * GET     /api/funcs/:id          ->  show
 * PUT     /api/funcs/:id          ->  update
 * DELETE  /api/funcs/:id          ->  destroy
 */

import { Func } from '../../sqldb';

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

// Get Function List with  System_defined = 1
export function index(req, res) {
  Func.findAll({
    where: {
      system_defined: 1,
    },
  })
  .then(response => res.json({ response }))
  .catch(err => handleError(res, 500, err));
}

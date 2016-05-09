/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/welcomes              ->  index
 * POST    /api/welcomes              ->  create
 * GET     /api/welcomes/:id          ->  show
 * PUT     /api/welcomes/:id          ->  update
 * DELETE  /api/welcomes/:id          ->  destroy
 */

import { Welcome } from '../../sqldb';

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  return res.status(statusCode).send(err);
}

// Gets a list of Welcomes
export function index(req, res) {
  Welcome.findAll()
    .then(welcomes => res.json(welcomes))
    .catch(err => handleError(res, 500, err));
}


export function preScreenedView(req, res) {
  // Approval Status
  // 1 -> Approved
  // 2 -> Reject
  // 3 -> Duplicate
  Welcome.find({
    where: {
      id: req.params.id,
      con_id: req.user.id,
    },
  })
    .then(qWelcome => res.json(qWelcome))
    .catch(err => handleError(res, 500, err));
}

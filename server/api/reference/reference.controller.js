/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobs              ->  index
 * POST    /api/jobs              ->  create
 * GET     /api/jobs/:id          ->  show
 * PUT     /api/jobs/:id          ->  update
 * DELETE  /api/jobs/:id          ->  destroy
 */

import { Reference } from '../../sqldb';

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

// Gets a list of References
export function index(req, res) {
  // Approval Status
  // 0 -> Action Required 1 -> Approved 2 -> Reject 3 -> Duplicate
  Reference.findAll({ where: { con_id: req.user.id } })
    .then(refereneces => res.json(refereneces))
    .catch(err => handleError(res, 500, err));
}

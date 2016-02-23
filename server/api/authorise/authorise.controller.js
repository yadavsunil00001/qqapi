/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/authorise              ->  index
 * POST    /api/authorise              ->  create
 * GET     /api/authorise/:id          ->  show
 * PUT     /api/authorise/:id          ->  update
 * DELETE  /api/authorise/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Authorise, App} from '../../sqldb';
import oAuth from '../../components/oauthjs';

function handleError(res, statusCode,err) {
  statusCode = statusCode || 500;
  return res.status(statusCode).send(err);
}

export function index(req, res){
  return App.findOne({
      where: {
        client_id: req.query.client_id,
        redirect_uri: req.query.redirect_uri,
      },
      attributes: ['id', 'name'],
    })
    .then(model => {
      if (!model) return res.status(404).json({ error: 'Invalid Client' });
      return res.json(model);
    })
    .catch(err => handleError(res,500,err));
}

exports.create = oAuth.authCodeGrant((req, callback) => {
  if (req.body.allow !== 'true') return callback(null, false);
  callback(null, true, req.user);
})




/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/login              ->  index
 * POST    /api/login              ->  create
 * GET     /api/login/:id          ->  show
 * PUT     /api/login/:id          ->  update
 * DELETE  /api/login/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import config from '../../config/environment';
import request from 'request';
console.log(config);
export function login(req, res){
  const options = {
    url: `${config.OAUTH_SERVER}${config.OAUTH_ENDPOINT}`,
    auth: {
      user: config.PARTNER_CLIENT_ID,
      pass: config.PARTNER_CLIENT_SECRET,
    },
    form: {
      grant_type: 'authorization_code',
      redirect_uri: `${config.PARTNER_REDIRECT_URI}`,
      code: req.body.code,
    },
  };
  console.log(options)
  request.post(options, function handleRes(err, apires, body) {
    if (err) return res.status(500).send(err);
    return res.status(apires.statusCode).send(body);
  });
}

export function refresh(req, res){
  const options = {
    url: `${config.OAUTH_SERVER}${config.OAUTH_ENDPOINT}`,
    auth: {
      user: config.PARTNER_CLIENT_ID,
      pass: config.PARTNER_CLIENT_SECRET,
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: req.body.refresh_token,
    },
  };

  request.post(options, function handleRes(err, apires, body) {
    if (err) return res.status(500).send(err);
    return res.status(apires.statusCode).send(body);
  });
}

export function logout(req, res){
  const options = {
    url: `${config.OAUTH_SERVER}${config.OAUTH_ENDPOINT}/${req.body.access_token}`,
    auth: {
      user: config.PARTNER_CLIENT_ID,
      pass: config.PARTNER_CLIENT_SECRET,
    },
  };

  request.del(options, function handleRes(err, apires, body) {
    if (err) return res.status(500).send(err);
    return res.status(apires.statusCode).send(body);
  });
}

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
import {Login} from '../../sqldb';

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
    res.status(statusCode).send(err);
  };
}

// Gets a list of Logins
export function index(req, res) {
  Login.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Login from the DB
export function show(req, res) {
  Login.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Login in the DB
export function create(req, res) {
  Login.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Login in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Login.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Login from the DB
export function destroy(req, res) {
  Login.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function login(req, res){
  const options = {
    url: `${config.OAUTH_SERVER}${config.OAUTH_ENDPOINT}`,
    auth: {
      user: config.HIRE_CLIENT,
      pass: config.HIRE_SECRET,
    },
    form: {
      grant_type: 'authorization_code',
      redirect_uri: `${config.OAUTH_REDIRECT_URI}`,
      code: req.body.code,
    },
  };

  request.post(options, function handleRes(err, apires, body) {
    if (err) return res.status(500).send(err);
    return res.status(apires.statusCode).send(body);
  });
}

export function refresh(req, res){
  const options = {
    url: `${config.OAUTH_SERVER}${config.OAUTH_ENDPOINT}`,
    auth: {
      user: config.HIRE_CLIENT,
      pass: config.HIRE_SECRET,
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
      user: config.HIRE_CLIENT,
      pass: config.HIRE_SECRET,
    },
  };

  request.del(options, function handleRes(err, apires, body) {
    if (err) return res.status(500).send(err);
    return res.status(apires.statusCode).send(body);
  });
}

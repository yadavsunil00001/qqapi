/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/states              ->  index
 * POST    /api/states              ->  create
 * GET     /api/states/:id          ->  show
 * PUT     /api/states/:id          ->  update
 * DELETE  /api/states/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { State, ActionableState } from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of States
export function index(req, res) {
  State
    .findAll({
      attributes: ['id', 'name', 'parent_id', 'config'],
      include: [
        {
          model: State,
          as: 'Childs',
          attributes: [['id', 'state_id']],
          required: false,
        },
        {
          model: ActionableState,
          as: 'Actions',
          where: {
            group_id: req.user.group_id,
          },
          attributes: [['child_id', 'state_id']],
          required: false,
          order: [['id', 'ASC']],
        },
      ],
      order: [['id', 'ASC']],
    })
    .then(function buildStateConfig(states) {
      const result = [];
      states.forEach(function formatStates(stateModel) {
        const state = stateModel.toJSON();
        if (state.Childs.length === 0) state.Childs.push({ state_id: state.id });
        state.config = JSON.parse(state.config); // Need to handle Parsing Error
        result[state.id] = _.pick(state, ['id', 'name', 'config', 'Childs', 'Actions']);
      });
      res.json(result);
    })
    .catch(handleError(res));
}

// Gets a single State from the DB
export function show(req, res) {
  State.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new State in the DB
export function create(req, res) {
  State.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing State in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  State.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a State from the DB
export function destroy(req, res) {
  State.find({
    where: {
      _id: req.params.id,
    },
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

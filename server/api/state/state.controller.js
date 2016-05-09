/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/states              ->  index
 * POST    /api/states              ->  create
 * GET     /api/states/:id          ->  show
 * PUT     /api/states/:id          ->  update
 * DELETE  /api/states/:id          ->  destroy
 */

import _ from 'lodash';
import { State, ActionableState } from '../../sqldb';

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
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
    .then(states => {
      const result = [];
      states.forEach(stateModel => {
        const state = stateModel.toJSON();
        if (state.Childs.length === 0) state.Childs.push({ state_id: state.id });
        state.config = JSON.parse(state.config); // Need to handle Parsing Error
        result[state.id] = _.pick(state, ['id', 'name', 'config', 'Childs', 'Actions']);
      });
      res.json(result);
    })
    .catch(handleError(res));
}


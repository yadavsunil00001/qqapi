/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  update
 * DELETE  /api/users/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db,{User, Group, Client, State, ActionableState} from '../../sqldb';

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

// Gets a list of Users
export function index(req, res) {
  User.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user.id;
  Promise.all([
      Group.findById(req.user.group_id, {
        attributes: ['id', 'name']
      }),

      Client.findById(req.user.client_id, {
        attributes: ['id', 'name','perc_revenue_share','termination_flag', 'consultant_survey', 'consultant_survey_time','eng_mgr_id' ]
      }),
      User.findById(req.user.id, {
        attributes: ['id', 'name','email_id', 'is_active'],
      }),
    ])
    .then(promiseReturns => {
      const group = promiseReturns[0];
      const client = promiseReturns[1];
      const user = promiseReturns[2];

      var whatBlocked = [];
      var is_blocked = false;

      if(user.is_active === 0 ){
        whatBlocked.push({ priority: 0,url:'terms-and-conditions'});
      }

      if(client.consultant_survey === 0 ){
        whatBlocked.push({ priority: 1 ,url:'preferences'})
      }

      if(client.termination_flag === 0 ){
        whatBlocked.push({ priority: 2,url:'terminated-message'})
      }
      return db.UserTawktoToken.find({
        attributes: ['id','access_token'],
        where:{
          user_id:client.eng_mgr_id
        }
      }).then(function(tawkToken){
        const userme = _.assign(req.user, {
          name: user.name,
          tawk_token: tawkToken.access_token,
          email_id: user.email_id,
          user_type: group.name,
          company_name: client.name,
          percRevenueShare: client.dataValues.perc_revenue_share,
          terminationFlag: client.dataValues.termination_flag,
          consultantSurvey: client.dataValues.consultant_survey,
          consultantSurveyTime: client.dataValues.consultant_survey_time,
          isBlocked : is_blocked,
          whatBlocked : whatBlocked
        });

        res.json(userme);
      })


    })
    .catch(err => next(err));
}

export function states(req, res, next) {
  db.State
    .findAll({
      attributes: ['id', 'name', 'parent_id', 'config'],
      include: [
        {
          model: db.State,
          as: 'Childs',
          attributes: [['id', 'state_id']],
          required: false,
        },
        {
          model: db.ActionableState,
          as: 'Actions',
          where: {
            group_id: 2,
          },
          attributes: [['child_id', 'state_id']],
          required: false,
        },
      ],
      order: [['id', 'ASC'], [{ model: db.ActionableState, as: 'Actions' }, 'id', 'ASC']],
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
    .catch(next);
}

// Gets a single User from the DB
export function show(req, res) {
  User.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new User in the DB
export function create(req, res) {
  User.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing User in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  User.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a User from the DB
export function destroy(req, res) {
  User.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

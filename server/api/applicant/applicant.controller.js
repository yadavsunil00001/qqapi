/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applicants              ->  index
 * POST    /api/applicants              ->  create
 * GET     /api/applicants/:id          ->  show
 * PUT     /api/applicants/:id          ->  update
 * DELETE  /api/applicants/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Applicant, ApplicantState, QueuedTask, Solr} from '../../sqldb';
import buckets from './../../config/buckets';
import stakeholders from './../../config/stakeholders';
import phpSerialize from './../../components/php-serialize';
import config from './../../config/environment';


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
    console.log("ERROR: ",err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of UserJobApplicants
export function index(req, res) {
  const offset = req.query.offset || 0;
  const limit = (req.query.limit > 20) ? 20 : req.query.limit || 10;
  const fl = req.query.fl || [
      'id', 'name', 'exp_designation', 'edu_degree', 'exp_salary','client_name',
      'exp_employer', 'total_exp', 'exp_location', 'state_id',
      'state_name', 'applicant_score', 'created_on'
    ].join(',');

  const rawStates = (req.query.state_id) ? req.query.state_id.split(',') : ['ALL'];
  const bucket = buckets[stakeholders[req.user.group_id]];
  const states = [];
  rawStates.forEach(function normalize(state) {
    if (isNaN(state)) if (bucket[state]) bucket[state].map(s => states.push(s));

    if (_.isInteger(state) || ~bucket.ALL.indexOf(Number(state))) states.push(Number(state));
  });
  //var solrQuery = solr.createQuery().q('({!child of="type_s:job"}owner_id:' + clientId +
//      ') AND type_s:applicant AND ' + stateParam).fl(fl).sort({_root_: 'DESC', type_s: 'DESC'}).start(start).rows(rows);

  const solrQuery = Solr.createQuery()
    .q('(owner_id:' + req.user.id +') AND type_s:applicant ')
    // {!child of="type_s:job"}
    .sort({_root_: 'DESC', type_s: 'DESC'})
    .fl(fl)
    .matchFilter('state_id', `(${states.join(' OR ')})`)
    .start(offset)
    .rows(limit);

  if (req.query.interview_time) {
    solrQuery.rangeFilter([
      {
        field: 'interview_time',
        start: req.query.interview_time.split(',')[0] || '*',
        end: req.query.interview_time.split(',')[1] || '*'
      }
    ]);
  }
  Solr.get('select', solrQuery, function solrCallback(err, result) {
    if (err) return res.status(500).json(err);
    res.json(result.response.docs);
  });
}



// Gets a single Applicant from the DB
export function show(req, res) {
  Applicant.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Applicant in the DB
export function create(req, res) {
  Applicant.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Applicant in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Applicant.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Applicant from the DB
export function destroy(req, res) {
  Applicant.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Change State For Applicant
export function changeState(req, res){
  console.log("1",req.body);
  //return res.json("[test]");
  // @todo Need to check eligibility of entity sending this post request
  // @todo Need to add applicant state id in applicant table
  ApplicantState
    .build(req.body)
    .set('user_id', req.user.id)
    .set('applicant_id', req.params.id)
    .save()
    .then((model) => {

      const data = phpSerialize.serialize({
        command: `${config.quarcPath}app/Console/cake`,
        params: [
          'state_change_action',
          '-s', model.state_id,
          '-a', model.applicant_id,
          '-u', model.user_id,
        ],
      });
      console.log(model);
      const task = {
        jobType: 'Execute',
        group: 'high',
        data,
      };

      QueuedTask.create(task);
      res.status(201).end();
    })
    .catch(handleError(res));
}


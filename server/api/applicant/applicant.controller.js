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
import {Applicant, Solr} from '../../sqldb';
import buckets from './../../config/buckets';
import stakeholders from './../../config/stakeholders';

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

// Gets a list of UserJobApplicants
export function index(req, res) {
  const offset = req.query.offset || 0;
  const limit = (req.query.limit > 20) ? 20 : req.query.limit || 10;
  const fl = req.query.fl || [
      'id', 'name', 'exp_designation', 'edu_degree', 'exp_salary','client_name',
      'exp_employer', 'total_exp', 'exp_location', 'state_id',
      'state_name', 'applicant_score', 'created_on',
    ].join(',');

  const rawStates = (req.query.state_id) ? req.query.state_id.split(',') : ['ALL'];
  const bucket = buckets[stakeholders['5']];
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
        end: req.query.interview_time.split(',')[1] || '*',
      },
    ]);
  }
  Solr.get('select', solrQuery, function solrCallback(err, result) {
    if (err) return res.status(500).json(err);
    res.json(result.response.docs);
  });
};



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


//export function index(req,res) {
//  var clientId = req.user.client_id;
//  var query = req.query;
//  var start = query.start;
//  var rows = query.rows;
//  var fl = query.fl;
//  var states = (query.state_id) ? query.state_id.split(',') : ['ALL'];
//
//  return new Promise(function (resolve, reject) {
//    if (!start) {
//      start = 0;
//    }
//
//    if (!rows) {
//      rows = 10;
//    } else if (rows > 20) {
//      rows = 20;
//    }
//
//    if (!fl) {
//      fl = [
//        'id',
//        'name',
//        'exp_designation',
//        'edu_degree',
//        'exp_salary',
//        'exp_employer',
//        'total_exp',
//        'exp_location',
//        'state_id',
//        'state_name',
//        'applicant_score',
//        'created_on',
//        '_root_',
//      ];
//    } else {
//      fl = fl.split(',');
//    }
//
//    var stateId = [];
//    var stateParam = '';
//    if (states.length > 0) {
//      states.forEach(function (state) {
//        var groupId = req.user.group_id;
//        var userType = stakeholders[groupId];
//        var res = buckets[userType];
//        if (isNaN(state)) {
//          stateId = (res[state]) ? stateId.concat(res[state]) : stateId;
//        } else if (Number.isInteger(Number(state))) {
//          stateId = stateId.concat(Number(state));
//        }
//      });
//
//      stateParam = ' state_id:(' + stateId.join(' OR ') + ')';
//    }
//
//    var solrQuery = solr.createQuery().q('({!child of="type_s:job"}owner_id:' + clientId +
//      ') AND type_s:applicant AND ' + stateParam).fl(fl).sort({_root_: 'DESC', type_s: 'DESC'}).start(start).rows(rows);
//    if (query.interview_time) {
//      solrQuery.rangeFilter([
//        {
//          field: 'interview_time',
//          start: query.interview_time.split(',')[0] || '*',
//          end: query.interview_time.split(',')[1] || '*',
//        },
//      ]);
//    }
//
//    Solr.get('select', solrQuery, function (err, obj) {
//      if (err) {
//        console.log(err);
//        return reject({
//          status: 500,
//          message: err,
//        });
//      } else {
//        var applicants = obj.response.docs;
//        var jobIds = [];
//
//        for (var i = 0; i <= applicants.length - 1; i++) {
//          jobIds.push(applicants[i]._root_);
//        }
//
//        resolve({jobIds: jobIds, applicants: applicants});
//      }
//    });
//  }).then(function (dbres) {
//    if (dbres === null) {
//      return Promise.reject(HTTPstatus.internalServerError);
//    }
//
//    return new Promise(function (resolve, reject) {
//      var jobIds = dbres.jobIds;
//      var applicants = dbres.applicants;
//
//      // handle for no job results
//      if (jobIds.length === 0) {
//        return resolve({
//          data: [],
//          status: HTTPstatus.ok.status,
//          message: HTTPstatus.ok.message,
//        });
//      }
//
//      var fl = ['role', 'id'];
//      var solrInnerQuery = solr.createQuery().q('type_s:job AND _root_:(' + jobIds.join(' OR ') + ')').fl(fl);
//
//      solr.get('select', solrInnerQuery, function (err, obj) {
//        if (err) {
//          return reject(HTTPstatus.internalServerError);
//        }
//
//        var jobs = obj.response.docs;
//        for (var i = 0; i <= applicants.length - 1; i++) {
//          for (var j = 0; j <= jobs.length - 1; j++) {
//            if (jobs[j].id === applicants[i]._root_) {
//              applicants[i]._root_ = jobs[j];
//            }
//          }
//        }
//
//        return resolve({
//          data: applicants,
//          status: HTTPstatus.ok.status,
//          message: HTTPstatus.ok.message,
//        });
//      });
//    });
//  });
//},

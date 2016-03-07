/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobs              ->  index
 * POST    /api/jobs              ->  create
 * GET     /api/jobs/:id          ->  show
 * PUT     /api/jobs/:id          ->  update
 * DELETE  /api/jobs/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db,{User,Job,JobAllocation, Solr} from '../../sqldb';

function handleCatch(res, statusCode){
  return function(err){
    res.status(500).json(err);
  }
}
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

// Gets a list of Jobs
export function index(req, res) {
  // Todo: ORM Impl: Writtern manual query becasue of currently sequelize don't have Multidatabase Join Support
  const query =req.query.query || "";
  db.sequelizeQuarc.query(`
      SELECT
        Job.id,
        Job.user_id,
        Job.role,
        Job.job_code,
        JobStatus.name AS job_status,
        JobStatus.id AS job_id,
        JobScore.consultant AS consultant,
        JobScore.id AS job_score
      FROM gloryque_quarc.jobs AS Job LEFT JOIN gloryque_quarc.job_statuses AS JobStatus
          ON (Job.job_status_id = JobStatus.id)
        LEFT JOIN gloryque_quarc.job_scores AS JobScore ON (Job.job_score_id = JobScore.id)
        LEFT JOIN gloryque_quarc.job_allocations AS JobAllocation ON (Job.id = JobAllocation.job_id)
        LEFT JOIN gloryque_quarc.consultant_responses AS ConsultantResponse
          ON (ConsultantResponse.id = JobAllocation.consultant_response_id AND ConsultantResponse.user_id = '${req.user.id}')
        INNER JOIN gloryque_quantum.users AS User ON (Job.user_id = User.id)
      WHERE JobAllocation.user_id = ${req.user.id} AND JobAllocation.status = '1' AND ConsultantResponse.response_id = 1 AND
            Job.status = '1' AND ((Job.role LIKE '%${query}%') OR (User.username LIKE '%${query}%') OR (User.name LIKE '%${query}%'))
      GROUP BY Job.id
      ORDER BY JobScore.consultant DESC
      LIMIT ${(req.query.limit > 20) ? 20 : req.query.limit || 10}
      OFFSET ${req.query.offset || 0}`,
      {type: db.Sequelize.QueryTypes.SELECT})
      .then(jobs => {
        return res.json(jobs)
      }).catch(err => handleError(res,500,err))

}

// Gets a list of jobs depending on response id
export function search(req, res) {
  const  user_id = req.user.id;
  const response = {'Accepted':1, 'Hold':2, 'Rejected':3};
  const responseId = response[req.query.response];

  const offset = req.query.offset || 0;
  const limit = (req.query.limit > 20) ? 20 : req.query.limit || 10;

    const fl = req.query.fl || [
        'updated_on','role','owner_id','consultant_score','direct_line_up','job_nature','eng_mgr_name',
        'eng_mgr_name_sf','max_sal','max_exp','recruiter_username','id','job_code','client_name',
        'client_name_sf','email','min_sal','min_exp','client_score','type_s',
        'screening_score','total_applicants','job_status','created_on',
        'job_location','vacancy','skills'
      ].join(',');


    db.sequelizeQuarc.query(`
        SELECT
            JA.job_id,
            JA.user_id,
            MAX(CR.id) AS consultant_response_id,
            CR.response_id,
            R.name
        FROM
            gloryque_quarc.job_allocations AS JA
                LEFT JOIN
            gloryque_quarc.consultant_responses AS CR ON CR.id = JA.consultant_response_id
                LEFT JOIN
            gloryque_quarc.responses AS R ON CR.response_id = R.id
        WHERE
            JA.user_id = ${user_id} AND CR.response_id = ${responseId}
        GROUP BY CR.job_id , CR.user_id;
        `,{type: db.Sequelize.QueryTypes.SELECT})
    .then(function(jobs){
      jobs = _.map(jobs,'job_id');
      let insideQuery = jobs.join(' OR ');
      // After getting job_id fetching data from Solr
      const solrQuery = Solr.createQuery()
        .q('id:('+insideQuery+') AND type_s:job ')
        .fl(fl);
      Solr.get('select', solrQuery, function solrCallback(err, result) {
        if (err) return res.status(500).json(err);
        res.json(result.response.docs);
      });
    })
    .catch(handleCatch(res));

}

// Gets a single Job from the DB
export function show(req, res) {
  const fl = req.query.fl || [
      'updated_on','role','owner_id','consultant_score','direct_line_up','job_nature','eng_mgr_name',
      'eng_mgr_name_sf','max_sal','max_exp','recruiter_username','id','job_code','client_name',
      'client_name_sf','email','min_sal','min_exp','c','ient_score','type_s',
      'screening_score','total_applicants','job_status','created_on',
      'job_location','vacancy','skills'
    ].join(',');

  const solrQuery = Solr.createQuery()
    .q(`id:${req.params.jobId} AND type_s:job`)
    .fl(fl);
  Solr.get('select', solrQuery, function solrCallback(err, result) {
    if (err) return res.status(500).json(err);
    let responsJson =  (result.response.docs instanceof Array) ? result.response.docs[0] : result.response.docs
    res.json(responsJson);
  });
}

// Creates a new Job in the DB
export function create(req, res) {
  Job.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Job in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Job.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Job from the DB
export function destroy(req, res) {
  Job.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


// TODO - CREATE A MODAL FOR CONSULTANT RESPONSES
// To Insert a consultant response for a Particular Job
export function consultantResponse(req, res) {
  // 1 -> Accepted
  // 2 -> Hold
  // 3 -> Rejected

  db.sequelizeQuarc.query('INSERT INTO `gloryque_quarc`.`consultant_responses` (`job_id`, `user_id`, `response_id`)' +
    ' VALUES ('+req.params.jobId+', '+req.user.id+','+req.body.responseId+');')
  .then(function(rows){
    let genereatedResponseId = rows[0]['insertId'];

    return db.sequelizeQuarc.query('UPDATE `gloryque_quarc`.`job_allocations` SET ' +
      '`consultant_response_id` = ' + genereatedResponseId +
      ' WHERE ' +
      '`job_id` = '+req.params.jobId+' AND ' +
      '`user_id` = '+req.user.id+' ; ')
    .then(function(rows){
      res.json(rows);
    }).catch(handleError(res));
  }).catch(handleError(res));
}

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
import db, {BUCKETS,User,Job,JobAllocation, Solr,sequelizeQuarc,Sequelize,Region,JobScore,JobStatus,ClientPayment,
  ConsultantResponse,Welcome} from '../../sqldb';

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

function handleError(res, statusCode,err ) {
  console.log("handleError",err)
  statusCode = statusCode || 500;
  res.status(statusCode).send(err);
}

// Gets a list of Jobs
export function index(req, res) {
  // Todo: ORM Impl: Writtern manual query becasue of currently sequelize don't have Multidatabase Join Support
  const query =req.query.query || "";

  const rawStates = (req.query.status) ? req.query.status.split(',') : ['ALL'];
  const bucket = { HIGH_PRIORITY:[1], OPEN:[2], HOLD:[3], CLOSED:[4], ALL: [ 1,2,3,4 ] };
  const states = [];

  rawStates.forEach(function boostStates(state, sIndex) {
    // add weight to each state depending on positon in state array
    if (isNaN(state) && bucket[state]) {
      bucket[state].forEach((s, i) => states.push(s));
    }

    if (_.isInteger(state) || ~bucket.ALL.indexOf(Number(state))) {
      states.push(state);
    }
  });


  const countQueryPr = !req.query.meta || req.query.offset != 0 ? []: sequelizeQuarc.query(`
    SELECT
      COUNT(JobStatus.id) as jobStatusCount,
      JobStatus.name AS jobStatusName
    FROM gloryque_quarc.jobs AS Job LEFT JOIN gloryque_quarc.job_statuses AS JobStatus
        ON (Job.job_status_id = JobStatus.id)
      LEFT JOIN gloryque_quarc.job_allocations AS JobAllocation ON (Job.id = JobAllocation.job_id)
      LEFT JOIN gloryque_quarc.consultant_responses AS ConsultantResponse
        ON (ConsultantResponse.id = JobAllocation.consultant_response_id AND ConsultantResponse.user_id = '${req.user.id}')
      INNER JOIN gloryque_quantum.users AS User ON (Job.user_id = User.id)
    WHERE JobAllocation.user_id = ${req.user.id}
          AND JobAllocation.status = '1'
          AND ConsultantResponse.response_id = 1
          AND Job.status = '1'
          AND ((Job.role LIKE '%${query}%') OR (User.username LIKE '%${query}%') OR (User.name LIKE '%${query}%'))
    GROUP BY JobStatus.id`,{type: Sequelize.QueryTypes.SELECT});


  const queryPr = sequelizeQuarc.query(`
      SELECT
        Job.id,
        Job.user_id AS owner_id,
        Job.role,
        Job.job_code AS job_code,
        JobStatus.name AS job_status,
        JobStatus.id AS job_id,
        JobScore.consultant AS consultant_score,
        JobScore.id AS job_score,
        User.name AS owner,
        Client.name AS owner_name

      FROM gloryque_quarc.jobs AS Job LEFT JOIN gloryque_quarc.job_statuses AS JobStatus
          ON (Job.job_status_id = JobStatus.id)
        LEFT JOIN gloryque_quarc.job_scores AS JobScore ON (Job.job_score_id = JobScore.id)
        LEFT JOIN gloryque_quarc.job_allocations AS JobAllocation ON (Job.id = JobAllocation.job_id)
        LEFT JOIN gloryque_quarc.consultant_responses AS ConsultantResponse
          ON (ConsultantResponse.id = JobAllocation.consultant_response_id AND ConsultantResponse.user_id = '${req.user.id}')
        INNER JOIN gloryque_quantum.users AS User ON (Job.user_id = User.id)
        LEFT JOIN  gloryque_quantum.clients AS Client ON  (User.client_id = Client.id)
      WHERE JobAllocation.user_id = ${req.user.id} AND JobAllocation.status = '1' AND ConsultantResponse.response_id = 1 AND
            Job.status = '1'
            ${'AND JobStatus.id IN (' + states.join(' , ')  + ") "}
            AND ((Job.role LIKE '%${query}%') OR (User.username LIKE '%${query}%') OR (User.name LIKE '%${query}%'))
      GROUP BY Job.id
      ORDER BY JobScore.consultant DESC
      LIMIT ${(req.query.limit > 20) ? 20 : req.query.limit || 10}
      OFFSET ${req.query.offset || 0}`,
      {type: Sequelize.QueryTypes.SELECT})
    return Promise.all([countQueryPr,queryPr])
      .then(prRe => {
        const jobsCount = CakeList(prRe[0],'jobStatusName','jobStatusCount')
        const jobs = prRe[1]
        return res.json({jobs,meta:{jobsCount}})
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


    sequelizeQuarc.query(`
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
        `,{type: Sequelize.QueryTypes.SELECT})
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

function CakeList(jsonArray,key,value){
  var keyArray = _.map(jsonArray,key);
  var valueArray = _.map(jsonArray,value);
  var map = {};
  keyArray.map(function(item,index){
    map[item] = valueArray[index];
    return item
  });
  return map;
}

// List Jobs allocationed to consultant
export function allocationStatusNew(req, res) {
  const query = req.query.q || '';

  const rawStates = (req.query.status) ? req.query.status.split(',') : ['ALL'];
  //
  //[{ id:0,name:'New'},{ id:1, name:'Accepted'},{id:2,name:'Hide'},{id:3,name:'Rejected'},{id:'all',name:'All'}]
  const bucket = {
    NEW:[0], //  Using sql query Null is assumed as 0
    ACCEPTED:[1],
    HIDDEN:[2], // Proxy for HOLD
    HOLD:[2],
    REJECTED:[3],
    ALL:[0,1,2,3]
  };

  const states = [];

  rawStates.forEach(function normalize(state) {
    if (isNaN(state)) if (bucket[state.toUpperCase()]) bucket[state].map(s => states.push(s));

    if (_.isInteger(state) || ~bucket.ALL.indexOf(Number(state))) states.push(Number(state));
  });


  const sqlQuery = `
  SELECT * FROM (SELECT
    Job.id,
    Job.role,
    Job.user_id,
    Job.job_status_id,
    Job.job_score_id,
    Job.region_id,
    Job.min_sal,
    Job.max_sal,
    JobAllocation.id AS allocation_id,
    COALESCE(ConsultantResponse.response_id,0) AS response_id,
    Client.id AS client_id,
    Client.name AS owner_company
  FROM gloryque_quarc.job_allocations AS JobAllocation LEFT JOIN gloryque_quarc.jobs AS Job
      ON (JobAllocation.job_id = Job.id AND Job.status = '1')
    LEFT JOIN gloryque_quarc.consultant_responses AS ConsultantResponse
      ON (JobAllocation.consultant_response_id = ConsultantResponse.id)
    LEFT JOIN gloryque_quantum.users AS User
      ON (Job.user_id = User.id)
    LEFT JOIN gloryque_quantum.clients AS Client
      ON ( Client.id = User.client_id)
  WHERE JobAllocation.user_id = ${req.user.id} AND Job.status = '1' AND JobAllocation.status = '1'
  GROUP BY JobAllocation.job_id) AS TEMP ${ states.length ? 'WHERE (role LIKE "%'+query+'%" OR owner_company LIKE "%'+query+'%" ) AND response_id IN ('+ states.join()+ ')':'' }
  LIMIT ${ req.query.limit ? parseInt(req.query.limit) : 100 }
  OFFSET ${req.query.offset || 0} `;

  let priorityPromise = JobStatus.findAll({
    attributes: ['id','name']
  })

  sequelizeQuarc
    .query(sqlQuery, {type: Sequelize.QueryTypes.SELECT})
    .then(jobs => {

      let jobCountPromise = [];
      if (req.query.offset == 0) {
        const countQuery = `
            SELECT response_id ,count(response_id) AS count FROM (SELECT
                  Job.id ,
                COALESCE(ConsultantResponse.response_id,0) AS response_id
              FROM gloryque_quarc.job_allocations AS JobAllocation LEFT JOIN gloryque_quarc.jobs AS Job
                  ON (JobAllocation.job_id = Job.id AND Job.status = '1')
                LEFT JOIN gloryque_quarc.consultant_responses AS ConsultantResponse
                  ON (JobAllocation.consultant_response_id = ConsultantResponse.id)
                LEFT JOIN gloryque_quantum.users AS User
                  ON (Job.user_id = User.id)
                LEFT JOIN gloryque_quantum.clients AS Client
                  ON ( Client.id = User.client_id)
              WHERE JobAllocation.user_id = ${req.user.id} AND Job.status = '1' AND JobAllocation.status = '1'
              GROUP BY JobAllocation.job_id) AS TEMP
            GROUP BY  response_id`;

        jobCountPromise = sequelizeQuarc.query(countQuery, {type: Sequelize.QueryTypes.SELECT}).then(countResult =>{
          const jobCountObject = CakeList(countResult,'response_id','count');

          // Calculate all count
          var currentStatesCount = 4; //    ['NEW', 'ACCEPTED','HOLD', 'REJECTED'].length
          var jobCount= [];
          var total = 0;
          for(var i=0;i < currentStatesCount;i++) {
            if(typeof jobCountObject[i] !== 'undefined'){
              total += jobCountObject[i]
            } else {
              jobCountObject[i] = 0
            }
            jobCount.push({id:i,count:jobCountObject[i]})
          }
          jobCount.push({id:'all',count:total})//    ['NEW', 'ACCEPTED','HOLD', 'REJECTED'].length
          return jobCount;
        })
      }

      if(jobs.length){
        const userIds = _.map(jobs,'user_id')
        const regionIds = _.map(jobs,'region_id')
        const jobScoreIds = _.map(jobs,'job_score_id')
        const clientIds = _.map(jobs,'client_id')
        let userPromise = User.findAll({
          attributes: ['id','name'],
          where:{
            id: userIds
          }
        });

        let regionPromise = Region.findAll({
            attributes: ['id','region'],
            where:{
              id: regionIds
            }
          });

        let jobScorePromise = JobScore.findAll({
          attributes: ['id','consultant'],
          where:{
            id: jobScoreIds
          }
        });

        let clientPaymentPromise = ClientPayment.findAll({
          attributes: ['id','client_id','isFixed'],
          where:{
            client_id: clientIds
          },
          raw:true
        })

        return Promise.all([userPromise,regionPromise,jobScorePromise,priorityPromise,clientPaymentPromise,jobCountPromise]).then(promiseReturnArray=>{

          const users = CakeList(promiseReturnArray[0],'id','name');
          const regions = CakeList(promiseReturnArray[1],'id','region');
          const jobScores = CakeList(promiseReturnArray[2],'id','consultant');
          const priority = CakeList(promiseReturnArray[3],'id','name');
          const deepClientPayments = promiseReturnArray[4];
          const jobCount = promiseReturnArray[5]

          // DEEP Query Job ClientPayments
          let clientPayments = {};
          deepClientPayments.map(function(item,index){
            clientPayments[item.client_id] = clientPayments[item.client_id] ? clientPayments[item.client_id] : [];
            clientPayments[item.client_id].push(item)
            return item;
          });
          jobs = jobs.map(function(job) {
            job.clientPayments = clientPayments[job.client_id]
            return job;
          }); // DEEP Query Job ClientPayments

          jobs = jobs.map(function(job){
            job.clientPayments =  clientPayments[job.client_id]
            job.owner = users[parseInt(job.user_id)]
            job.region = regions[parseInt(job.region_id)]
            job.score = jobScores[parseInt(job.job_score_id)]
            job.priority = priority[parseInt(job.job_status_id)]
            if(job.clientPayments){
              if(job.clientPayments.length>0){
                if(job.clientPayments[0]['isFixed']==1){
                  job.payment = 'Fixed - Standard';
                } else if(job.clientPayments[0]['isFixed']==2) {
                  job.payment = 'Fixed - Customised';
                } else if(job.clientPayments[0]['isFixed']==3){
                  job.payment =  '1% EMI - Customised';
                } else {
                  job.payment = '1% EMI - Standard';
                }
              } else{
                job.payment = '-';
              }
              delete job.clientPayments;
            }

            return job;
          });

          return res.json({jobs:jobs,meta:{jobsCount:jobCount}})

          //return res.json({jobs:allJobs,stateMenu:[{ id:0,name:'New'},{ id:1, name:'Accepted'},{id:2,name:'Hide'},{id:3,name:'Rejected'},{id:'all',name:'All'}]})

        })
      } else {
        return jobCountPromise.then(jobCount => {
          return res.status(200).json({jobs:[],meta:{jobsCount:jobCount}})
        })
      }
    })
  .catch(err => handleError(res,500,err))
}

// List Jobs allocationed to consultant
export function allocationStatusNewCount(req, res) {
  return JobAllocation.count({
      where: {consultant_response_id: null, user_id: req.user.id},
      include: [{model: db.Job, where: {status: 1}}]
    })
    .then(count => res.json({count})).catch(err=>handleError(res, 500, err))
}

// Gets a single Job from the DB
export function show(req, res) {
  // @todo refine and restructure flow


  const following = req.followingJobs ? ` OR id:(${req.followingJobs})` : '';
  const fl = req.query.fl || [
      'id', 'role', 'owner_id', 'max_sal', 'min_sal', 'job_code', 'min_exp', 'max_exp',
      'client_name', 'job_status', 'job_status_id', 'required_skills', 'optional_skills',
      'interview_addr', 'interview_place_direction', 'days_per_week', 'job_location',
      'end_work_time', 'start_work_time', 'degrees', 'institutes', '_root_', 'vacancy',
      'employers', 'industries', 'perks', 'preferred_genders', 'responsibility',
    ].join(',');

  const solrQuery = db.Solr
    .createQuery()
    .q(`id:${req.params.jobId} AND type_s:job `)//AND (owner_id:${req.user.id}${following})
    .fl(fl);


  db.Solr.get('select', solrQuery, function solrCallback(err, result) {
    if (err) return handleError(res,500,err);
    const job = result.response.docs;
    const clientAttr = [
      'id', 'description', 'reg_address', 'min_emp', 'max_emp', 'website',
      'apple_store_link', 'playstore_link', 'windows_store_link'
    ]
    // @todo handle error from components/error
    if (!job.length) return handleError(res,404,new Error('Job not found'));
    if (~fl.indexOf('_root_')) {
      return db.User.findById(job[0].owner_id).then(hr => {
        console.log("hr",hr.client_id)
        return db.Client.findById(hr.client_id, {
          attributes: clientAttr,
          include: [db.Logo],
        }).then(clientModel => {
          console.log("finding clientpayments ",clientModel.id)
          return ClientPayment.findAll({
            attributes: ['id', 'client_id', 'isFixed'],
            where: {
              client_id: clientModel.id
            },
            raw: true
          }).then(clientPayments => {
            const client = clientModel.toJSON();
            if (clientPayments) {
              if (clientPayments.length > 0) {
                if (clientPayments[0]['isFixed'] == 1) {
                  client.payment = 'Fixed - Standard';
                } else if (clientPayments[0]['isFixed'] == 2) {
                  client.payment = 'Fixed - Customised';
                } else if (clientPayments[0]['isFixed'] == 3) {
                  client.payment = '1% EMI - Customised'; //'1% Module, No Replacement - Customised';
                } else {
                  client.payment = '1% EMI - Standard';  //'1% Module, No Replacement - Standard';
                }
              } else {
                client.payment = '-';
              }
            }




            const logo = new Buffer(client.Logo.logo).toString('base64');
            client.logo = `data:${client.Logo.mime};base64,${logo}`;
            job[0]._root_ = _.pick(client, clientAttr.concat(['logo','payment']));
            res.json(job[0]);
          })

        });
      })
    }
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

// To Insert a consultant response for a Particular Job
export function consultantResponse(req, res) {
  // 1 -> Accepted
  // 2 -> Hold
  // 3 -> Rejected
  const consultantResponse = {
    job_id: req.params.jobId,
    user_id: req.user.id,
    response_id: req.body.responseId
  };

  ConsultantResponse.create(consultantResponse)
    .then(function (savedConsultantResponse) {
      let genereatedResponseId = savedConsultantResponse.id;
      JobAllocation.update({consultant_response_id: genereatedResponseId}, {
        where: {
          job_id: req.params.jobId,
          user_id: req.user.id
        }
      }).then(function (rows) {
          res.json(rows);
        }).catch(err => handleError(res,500,err));
    }).catch(err => handleError(res,500,err));
}


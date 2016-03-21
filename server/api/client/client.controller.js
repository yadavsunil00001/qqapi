/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/clients              ->  index
 * POST    /api/clients              ->  create
 * GET     /api/clients/:id          ->  show
 * PUT     /api/clients/:id          ->  update
 * DELETE  /api/clients/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import moment from 'moment';
import db,{Client,Applicant, Job, JobApplication, ApplicantState, State, Func, Solr, User, JobAllocation,
  Industry, ClientPreferredFunction, ClientPreferredIndustry, Sequelize} from '../../sqldb';


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

function handleError(res, statusCode,err) {
  console.log("err",err)
  statusCode = statusCode || 500;
    res.status(statusCode).send(err);
}

// Gets a list of Clients
export function index(req, res) {
  Client.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Client from the DB
export function show(req, res) {
  Client.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Client in the DB
export function create(req, res) {
  Client.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(err => handleError(res, 500, err));
}

// Updates an existing Client in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Client.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(err => handleError(res, 500, err));
}

// Deletes a Client from the DB
export function destroy(req, res) {
  Client.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(err => handleError(res, 500, err));
}

// To get preferences of the consultant
export function checkTerminationStatus(req, res) {
  let clientId = req.user.client_id;
  Client.getTerminatedStatus(db, clientId)
    .then(response => {
      return res.json({response});
    })
    .catch(function (err) {
      return res.json({err});
    });
}
// TODO To be moved to config file
const ENUM = {
  CTC_RANGES: [{min: 0, max: 3}, {min: 3, max: 6}, {min: 6, max: 10}, {min: 10, max: 15}, {
    min: 15,
    max: 20
  }, {min: 20, max: 30}, {min: 30, max: 10000}]
};
export function preferences(req, res) {
  const client_id = req.user.client_id;
  var ctcRange = [{min:0,max:3,selected:true}, {min:10,max:15}, {min:20,max:30}, {min:30,max:100}]; // req.body.ctcRange
  const clientDataPromise = Client.find({
    where: {
      id: 173
    },
    attributes: ['id', 'name', 'termination_flag', 'perc_revenue_share', 'consultant_survey', 'bd_mgr_id', 'eng_mgr_id', 'min_ctc', 'max_ctc'],
  });

  const functionListPromise = Func.getFunctionList(db);
  const clientPreferredListPromise = ClientPreferredFunction.getClientPreferredFunctionList(db, client_id);

  const industryListPromise = Industry.getIndustryList(db);
  const clientIndustryListPromise = ClientPreferredIndustry.getClientPreferredIndustryList(db, client_id);

  return Promise.all([clientDataPromise, functionListPromise, clientPreferredListPromise, industryListPromise, clientIndustryListPromise])
    .then(promiseReturns => {
      var resultData = {};
      const clientData = promiseReturns[0]; // TODO After UI client data needs to be removed.
      resultData.functionList = promiseReturns[1];
      const  preferredFunctionList = promiseReturns[2];
      resultData.industryList = promiseReturns[3];
      const preferredIndustryList = promiseReturns[4];

      var preferredFunctionListIds = _.map(preferredFunctionList, 'func_id');
      resultData.functionList.map(function (item, index) {
        // Performance issue: to be improved : matching with all data
        var status = preferredFunctionListIds.indexOf(item.id);
        // Todo: @manjesh sequelizeInstance.dataValues need to simplified
        if (status !== -1) {
          item.dataValues.selected = true;
        } else {
          item.dataValues.selected = false;
        }
        return item
      });

      var preferredIndustryListIds = _.map(preferredIndustryList, 'industry_id');
      resultData.industryList.map(function (item, index) {
        // Performance issue: to be improved : matching with all data
        var status = preferredIndustryListIds.indexOf(item.id);
        // Todo: @manjesh sequelizeInstance.dataValues need to simplified
        if (status !== -1) {
          item.dataValues.selected = true;
        } else {
          item.dataValues.selected = false;
        }
        return item
      });

      var ctcRange = [clientData.min_ctc, clientData.max_ctc];
      resultData.ctcRange = ENUM.CTC_RANGES.map(function (item) {
        if (item.min >= ctcRange[0] && item.max <= ctcRange[1])
          item.selected = true;
        else
          item.selected = false;
        return item;
      });

      return res.json(resultData);

    })
    .catch(function (err) {
      res.json(err);
    })
}


export function updatePreferences(req, res){
//return res.json(req.body.industryList);
  // Inserting Client Preferred Function

  var ctcRange = _.filter(req.body.ctcRange,{ selected:true }); // req.body.ctcRange
  ctcRange = _.sortBy( _.filter(ctcRange,{ selected: true}),'min'); // req.body.ctcRange
  var minCTC = ctcRange[0].min;
  var maxCTC = ctcRange[ctcRange.length-1].max;
  var consultantSurveyTime = Date.now();
  var consultantSurvey = 0;

  Client.update({
    min_ctc: minCTC,
    max_ctc: maxCTC,
    consultant_survey_time: consultantSurveyTime,
    consultant_survey: consultantSurvey
  }, {
    where: {
      id : req.user.client_id
    }
  }).then(function() {

// Inserting Client Preferred Function
      const PromiseClientPreferredFunction = ClientPreferredFunction.destroy({
          where:{
            client_id:req.user.client_id
          }}
        )
        .then(affectedRows =>{
          let functionListToSave = _.filter(req.body.functionList,{ selected:true }); // req.body.ctcRange
          var clientPreferredFunctionData = functionListToSave.map(item => {return {client_id: req.user.client_id, func_id: item.id}});
          return ClientPreferredFunction.bulkCreate(clientPreferredFunctionData)
            .then(affectedRows => {
              return affectedRows;
            })
            .catch(err => handleError(res, 500, err));
        })
        .catch(err => handleError(res, 500, err));

      // Inserting Client Preferred Industry
      const PromiseClientPreferredIndustry = ClientPreferredIndustry.destroy({
          where:{
            client_id: req.user.client_id
          }}
        )
        .then(affectedRows =>{
          let industryListToSave = _.filter(req.body.industryList,{ selected:true }); // req.body.ctcRange
          var clientPreferredIndustryData = industryListToSave.map(item => {return {client_id: req.user.client_id, industry_id: item.id}});
          return ClientPreferredIndustry.bulkCreate(clientPreferredIndustryData)
            .then(affectedRows => {
              return affectedRows;
            })
            .catch(err => handleError(res, 500, err));
        })
        .catch(err => handleError(res, 500, err));

      return Promise.all([PromiseClientPreferredFunction,PromiseClientPreferredIndustry])
        .then(promiseResult => {
          return res.json("record updated");
        })
        .catch(err => handleError(res, 500, err));

  })
  .catch(err => handleError(res, 500, err));
}

export function dashboard(req, res) {

  Applicant.findAll({
    where: {
      user_id : req.user.id
    },
    attributes: ['id'/*[Sequelize.fn('count', Sequelize.col('*')),'count']*/],
    include: [
      {
        model: ApplicantState,
        attributes: [],
        where: {
          state_id : [6,22,32,33]
        },
        include: {
          model: State,
          attributes: ['name'],
          where: {
            //id : [6,22,32,33]
          }
        }
      }
    ],
    raw: true
  })
  .then(resultData => {
    // Getting count applicant ids wrt state ids
    console.log(resultData);
    var _count = _.countBy(_.map(resultData,"ApplicantStates.State.id"));
    // extracting applicant ids from result data which is used later to fetch data from query
    var _applicantIds = _.map(resultData,"id");
    var countData = [];
    for(var id in _count){
      var x = {};
      x.id = id;
      x.name = (_.filter(resultData,{"ApplicantStates.State.id":parseInt(id)})[0]["ApplicantStates.State.name"]);
      x.count = _count[id];
      countData.push(x);
    }
    // Fetching data from applicant using solr
    const solrQuery = Solr.createQuery()
      .q(` type_s:applicant`)
      .matchFilter('id', `(${_applicantIds.join(' ')})`);
    Solr.get('select', solrQuery, function solrCallback(err, result) {
      if (err) return handleError(res, 500,err);

      // Calculating Screening ratio
      const screeningDataPromise =  Applicant.count({
        where: {
          user_id : req.user.id
        },
        attributes: ['id'],
        include: [
          {
            model: ApplicantState,
            attributes: [],
            where: {
              state_id : [1,2,3,4,5,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,28,29,30,31,33,34,35,36,38]
            },
            include: {
              model: State,
              attributes: ['name']
            }
          }
        ],
        raw: true
      });

      const screeningAllDataPromise = Applicant.count({
          where: {
            user_id : req.user.id
          },
          attributes: ['id'],
          include: [
            {
              model: ApplicantState,
              attributes: [],
              where: {
                state_id : [1,2,3,4,5,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,28,29,30,31,33,34,35,36,38]
              },
              include: {
                model: State,
                attributes: ['name']
              }
            }
          ],
          raw: true
        });

      // Calculating shortlisting ratio
      const shortlistingDataPromise =  Applicant.count({
        where: {
          user_id : req.user.id
        },
        attributes: ['id'],
        include: [
          {
            model: ApplicantState,
            attributes: [],
            where: {
              state_id : [4,5,8,9,10,11,12,15,17,18,19,20,21,22,23,24,25,28,29,30,31,33,34,35,36,38]
            },
            include: {
              model: State,
              attributes: ['name']
            }
          }
        ],
        raw: true
      });

      const shortlistingAllDataPromise = Applicant.count({
        where: {
          user_id : req.user.id
        },
        attributes: ['id'],
        include: [
          {
            model: ApplicantState,
            attributes: [],
            where: {
              state_id : [2,3,4,5,8,9,10,11,12,15,17,18,19,20,21,22,23,24,25,28,29,30,31,33,34,35,36,38]
            },
            include: {
              model: State,
              attributes: ['name']
            }
          }
        ],
        raw: true
      });

      // TODO Refactor code to bring joining date
      const upcomingOfferDataPromise = Applicant.findAll({
        where: {
          user_id : req.user.id
        },
        attributes: ['id','name'],
        include: [
          {
            model: ApplicantState,
            attributes: [],
            where: {
              state_id : [10,20]
            },
            include: {
              model: State,
              attributes: ['name']
            }
          },
          {
            model: JobApplication,
            attributes: [],
            include: [{
              model: Job,
              attributes: ['role'],
            }]
          }
        ],
        raw: true
      });

      // TODO Refactor Code Optimization and upcoming interview data pending
      // New Profile data is allocated today data
      const promiseNewProfileData = JobAllocation.findAll({
        where: {
          user_id : req.user.id,
          created_on : {
            // TODO remove hard coding of gte
            //gte: moment().startOf('day').format('YYYY-MM-DD H:m:s')
            gte: '2016-02-18 00:00:00'
          }
        },
        attributes: ['job_id','created_on'],
        raw: true
      });

      // TODO Refactor code to bring Interview Date date
      const upcomingInterviewDataPromise = Applicant.findAll({
        where: {
          user_id : req.user.id
        },
        attributes: ['id','name'],
        include: [
          {
            model: ApplicantState,
            attributes: [],
            where: {
              state_id : [5, 8, 17]
            },
            include: {
              model: State,
              attributes: ['name']
            }
          },
          {
            model: JobApplication,
            attributes: [],
            include: [{
              model: Job,
              attributes: ['role'],
            }]
          }
        ],
        raw: true
      });



      return Promise.all([screeningDataPromise, screeningAllDataPromise, shortlistingDataPromise, shortlistingAllDataPromise,
          upcomingOfferDataPromise, promiseNewProfileData, upcomingInterviewDataPromise])
        .then(promiseReturns => {
          var screeningRatio = Math.round((promiseReturns[0] / promiseReturns[1]) * 100);
          var shortlistingRatio = Math.round((promiseReturns[2] / promiseReturns[3]) * 100);
          var _job_ids = _.map(promiseReturns[5],"job_id");
          // Checking if any job is allocated today or not
          if(_job_ids.length == 0){
            return res.json({ countData,
              applicantData: result.response.docs,
              screeningRatio: screeningRatio,
              shortlistingRatio: shortlistingRatio,
              upcomingOfferData: promiseReturns[4]
            });
          }else{
            // Fetching data from applicant using solr
            const solrQuery = Solr.createQuery()
              .q(` type_s:job`)
              .matchFilter('id', `(${_job_ids.join(' ')})`);
            Solr.get('select', solrQuery, function solrCallback(err, resultDataJobs) {
              if (err) return handleError(res, 500,err);
              return res.json({ countData,
                applicantData: result.response.docs,
                screeningRatio: screeningRatio,
                shortlistingRatio: shortlistingRatio,
                upcomingOfferData: promiseReturns[4],
                upcomingInterviewData: promiseReturns[5],
                newProfileData: resultDataJobs.response.docs
              });
            });
          } // End Checking if any job is allocated today or not
        });
    });
  })
  .catch(err => handleError(res, 500, err));
}
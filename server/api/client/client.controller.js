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
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
var wkhtmltopdf = require('wkhtmltopdf');
import db,{Client,Applicant, Job, JobApplication, ApplicantState, State, Func, Solr, User, JobAllocation,
  Industry, ClientPreferredFunction, ClientPreferredIndustry, Sequelize, QueuedTask} from '../../sqldb';
import config from './../../config/environment';
import phpSerialize from './../../components/php-serialize';

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

export function makeUserActive(req, res) {
  // get your data into a variable
  User.find({
    where: {
      id: req.user.id
    },
    attributes: ['id','name','email_id','timestamp'],
    include: {
      model: Client,
      attributes: ['name','perc_revenue_share','reg_address'],
    }
  })
  .then(user => {
    //console.log(user);
    //return res.json(user.Client.get('perc_revenue_share'));
    var client_data = {
      'current_date' :moment().format('Do MMMM YYYY'),
      'company_name' : user.Client.get('name'),
      'perc_revenue_share' : user.Client.get('perc_revenue_share'),
      'company_address' : user.Client.get('reg_address')
    };
    var options = {
      'pageSize': 'A4',
      'encoding': 'UTF-8',
      'no-print-media-type': true,
      'outline': true,
      'dpi': 300,
      'margin-bottom': 0,
      'margin-left': 5,
      'margin-right': 5,
      'margin-top': 5
    };
    // set up your handlebars template
    fs.readFile(path.join(config.root,'server','views','terms-and-condition-pdf.html'), 'utf8', function (err,data) {
        if (err) {
          return res.json(err);
        }
        // compile the template
        var template = handlebars.compile(data.replace(/\n|\r/g, ""));
        // call template as a function, passing in your data as the context
        var outputString = template(client_data);
        // TODO GENERATE HTML FOR FRONTEND
        wkhtmltopdf(outputString, options)
          .pipe(fs.createWriteStream(config.QDMS_PATH+'SignUps/'+req.user.id+'.pdf'));
        // Sending mail to user with attachement of file using queue
        const queueData = phpSerialize.serialize({
          settings: {
            subject: 'QuezX.com | Acceptance of Terms & Conditions',
            to: user.dataValues.email_id,
            bcc: 'agreement@quetzal.in',
            from: ['notifications@quezx.com', 'QuezX.com'],
            domain: 'Quezx.com',
            emailFormat: 'html',
            template: ['SignupConsultantEmail'],
            attachments : [
              {
                'terms_and_condition.pdf' : config.QDMS_PATH+'SignUps/'+req.user.id+'.pdf',
              }
            ]
          },
          vars: {
            consultantName: user.dataValues.Client.name
          }
        });
        const task = {
          jobType: 'Email',
          group: 'low',
          data: queueData
        };
      // Creating entry in queued task Ends here
      QueuedTask.create(task);
      // Updating user is_active flag and setting it to 1
      return User.update({
        is_active: 1
      }, {
        where: {
          id : req.user.id
        }
      }).then(function() {
         return
        })
        .catch(err => handleError(res,500,err));
    });
    return res.json(user);
  })
  .catch(err => handleError(res,500,err));
}

export function agreement(req, res) {
  // get your data into a variable
  User.find({
    where: {
      id: req.user.id
    },
    attributes: ['id','name','email_id','timestamp'],
    include: {
      model: Client,
      attributes: ['name','perc_revenue_share','reg_address'],
    }
  })
  .then(user => {
    var client_data = {
      'current_date' :moment().format('Do MMMM YYYY'),
      'company_name' : user.dataValues.Client.name,
      'perc_revenue_share' : user.dataValues.Client.perc_revenue_share,
      'company_address' : user.dataValues.Client.reg_address
    };
    // set up your handlebars template

    fs.readFile(path.join(config.root,'server','views','terms-and-conditions.html'), 'utf8', function (err,data) {
        if (err) {
          return res.json(err);
        }
        // compile the template
        var template = handlebars.compile(data.replace(/\n|\r/g, ""));
        // call template as a function, passing in your data as the context
        var outputString = template(client_data);
      return res.end(outputString);
    });
  })
  .catch(err => handleError(res,500,err));

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
      id: req.user.client_id
    },
    attributes: ['id', 'name', 'termination_flag', 'perc_revenue_share', 'consultant_survey', 'bd_mgr_id', 'eng_mgr_id', 'min_ctc', 'max_ctc'],
  });

  const functionListPromise = Func.getFunctionList(db);
  const clientPreferredListPromise = ClientPreferredFunction.getClientPreferredFunctionList(db, client_id);

  const industryListPromise = Industry.getIndustryList(db);
  const clientIndustryListPromise = ClientPreferredIndustry.getClientPreferredIndustryList(db, client_id);

  return Promise.all([clientDataPromise, functionListPromise, clientPreferredListPromise, industryListPromise, clientIndustryListPromise])
    .then(promiseReturns => {
      var allApplicants = {};
      const clientData = promiseReturns[0]; // TODO After UI client data needs to be removed.
      allApplicants.functionList = promiseReturns[1];
      const  preferredFunctionList = promiseReturns[2];
      allApplicants.industryList = promiseReturns[3];
      const preferredIndustryList = promiseReturns[4];

      var preferredFunctionListIds = _.map(preferredFunctionList, 'func_id');
      allApplicants.functionList.map(function (item, index) {
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
      allApplicants.industryList.map(function (item, index) {
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
      allApplicants.ctcRange = ENUM.CTC_RANGES.map(function (item) {
        if (item.min >= ctcRange[0] && item.max <= ctcRange[1])
          item.selected = true;
        else
          item.selected = false;
        return item;
      });

      return res.json(allApplicants);

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
  .then(allApplicants => {
    // Getting count applicant ids wrt state ids

    var _count = _.countBy(_.map(allApplicants,"ApplicantState.State.id"));
    // extracting applicant ids from result data which is used later to fetch data from query
    var _applicantIds = _.map(allApplicants,"id");
    var countData = [];
    for(var id in _count){
      var widgetItem = {};
      widgetItem.id = id;
      widgetItem.name = _.get(_.filter(allApplicants,{"ApplicantState.State.id":parseInt(id)})[0],"ApplicantState.State.name");
      widgetItem.count = _count[id];
      countData.push(widgetItem);
    }
    // Fetching data from applicant using solr
    const solrQuery = Solr.createQuery()
      .q(` type_s:applicant`)
      .fl('id,name,mobile,email,state_name,exp_designation,exp_employer,_root_')
      .matchFilter('id', `(${_applicantIds.join(' ')})`);
    Solr.get('select', solrQuery, function solrCallback(err, result) {
      if (err) return handleError(res, 500,err);
      var applicantData = result.response.docs;
        if(!allApplicants.length) return res.json(applicantData)

        const solrInnerQuery = db.Solr
          .createQuery()
          .q(`id:(${applicantData.map(a => a._root_).join(' OR ')}) AND type_s:job`)
          .fl(['role', 'id','client_name',]);

        // Get job to attach to results
        db.Solr.get('select', solrInnerQuery, function solrJobCallback(jobErr, result) {
          if (jobErr) return handleError(res, 500, jobErr);
          const jobs = result.response.docs;
          if (jobs.length) {
            applicantData.forEach(function attachJob(applicant, key) {
              applicantData[key]._root_ = jobs
                .filter(s => s.id === applicantData[key]._root_)[0];
            });
          }
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
                attributes: ['id', 'suggested_join_date'],
                where: {
                  state_id : [10,20],
                  suggested_join_date : {
                    gte: moment().startOf('day').format('YYYY-MM-DD H:m:s')
                  }
                },
                include: {
                  model: State,
                  attributes: ['name']
                }
              },
              {
                model: JobApplication,
                attributes: ['id'],
                include: [{
                  model: Job,
                  attributes: ['id','role','user_id'],
                }]
              }
            ],
            raw:true
          }).then(upcomingOfferApplicants => {
            var _user_ids = _.uniq(_.map(upcomingOfferApplicants,'JobApplications.Job.user_id'));
            return User.findAll({
              where: {
                id: _user_ids
              },
              attributes : ['id'],
              include: {
                model: Client,
                attributes: ['id','name']
              }

            }).then(_user_data => {
              //return _user_data;
              var upcomingOfferData = upcomingOfferApplicants.map(function(applicant) {
                const userId =_.get(applicant, 'JobApplications.Job.user_id');
                return {
                  id:_.get(applicant, 'id'),
                  name:_.get(applicant, 'name'),
                  stateId: _.get(applicant, 'ApplicantState.State.id'),
                  stateName:_.get(applicant, 'ApplicantState.State.name'),
                  jobId:_.get(applicant, 'JobApplications.Job.id'),
                  jobRole:_.get(applicant, 'JobApplications.Job.role'),
                  jobClientId: userId,
                  jobClientName: _.get(_.filter(_user_data,user => { return user.id==userId})[0],'Client.name'),
                  joinDate: moment(_.get(applicant, 'ApplicantState.suggested_join_date')).format('D/MM/YYYY')
                };
              });
              return upcomingOfferData;
            });
          });

          // TODO Refactor Code Optimization and upcoming interview data pending
          // New Profile data is allocated today data
          const promiseNewProfileData = JobAllocation.findAll({
            where: {
              user_id : req.user.id,
              created_on : {
                gte: moment().startOf('day').format('YYYY-MM-DD H:m:s')
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
                attributes: ['id', 'updated_on'],
                where: {
                  state_id : [5,8,17],
                  updated_on : {
                    gte: moment().startOf('day').format('YYYY-MM-DD H:m:s')
                  }
                },
                include: {
                  model: State,
                  attributes: ['name']
                }
              },
              {
                model: JobApplication,
                attributes: ['id'],
                include: [{
                  model: Job,
                  attributes: ['id','role','user_id'],
                }]
              }
            ],
            raw:true
          }).then(upcomingInterviewApplicants => {
            var _user_ids = _.uniq(_.map(upcomingInterviewApplicants,'JobApplications.Job.user_id'));
            return User.findAll({
              where: {
                id: _user_ids
              },
              attributes : ['id'],
              include: {
                model: Client,
                attributes: ['id','name']
              }

            }).then(_user_data => {
              //return _user_data;
              var upcomingInterviewData = upcomingInterviewApplicants.map(function(applicant) {
                const userId =_.get(applicant, 'JobApplications.Job.user_id');

                const day = moment().utcOffset("+05:30").calendar('2016-04-01', {
                  sameDay: '[Today]',
                  lastDay: '[Tomorrow]', //nextDay: '[Yesterday]',
                  sameElse: 'DD/MM/YYYY'
                });

                const time = moment(_.get(applicant, 'ApplicantState.updated_on')).format('h a')

                return {
                  id:_.get(applicant, 'id'),
                  name:_.get(applicant, 'name'),
                  //stateId: _.get(applicant, 'ApplicantStates.State.id'),
                  stateName:_.get(applicant, 'ApplicantState.State.name'),
                  jobId:_.get(applicant, 'JobApplications.Job.id'),
                  jobRole:_.get(applicant, 'JobApplications.Job.role'),
                  jobClientId: userId,
                  jobClientName: _.get(_.filter(_user_data,user => { return user.id==userId})[0],'Client.name'),
                  interviewTime:  time +", " + day,
                  updated_on:  moment(_.get(applicant, 'ApplicantState.updated_on')).format('D/MM/YYYY h a')
                };
              });
              return upcomingInterviewData;
            });
          });

          return Promise.all([screeningDataPromise, screeningAllDataPromise, shortlistingDataPromise, shortlistingAllDataPromise,
              upcomingOfferDataPromise, promiseNewProfileData, upcomingInterviewDataPromise])
            .then(promiseReturns => {
              var screeningRatio = Math.round((promiseReturns[0] / promiseReturns[1]) * 100);
              var shortlistingRatio = Math.round((promiseReturns[2] / promiseReturns[3]) * 100);
              var rating = (screeningRatio + shortlistingRatio)/200 * 5;
              var upcomingOfferData = promiseReturns[4];
              var newProfiles = promiseReturns[5];
              var upcomingInterviewData = promiseReturns[6];
              // Checking if any job is allocated today or not
              if(newProfiles.length == 0){
                var newProfileData = [];
                return res.json({
                  countData,
                  rating,
                  applicantData,
                  screeningRatio,
                  shortlistingRatio,
                  upcomingOfferData
                });
              } else{
                // Fetching data from applicant using solr
                const solrQuery = Solr.createQuery()
                  .q(`type_s:job`)
                  .fl('id,role,min_sal,max_sal,job_location')
                  .matchFilter('id', `(${_.map(newProfiles,"job_id").join(' ')})`);
                Solr.get('select', solrQuery, function solrCallback(err, allApplicantsJobs) {
                  if (err) return handleError(res, 500,err);
                  var newProfileData =  allApplicantsJobs.response.docs;

                  newProfileData = newProfileData.map(data => {
                    let profile = {id:data.id,jobLocation:data.job_location,role:data.role}
                    if(typeof data.max_sal !== undefined && typeof data.min_sal !== undefined ) {
                      if(data.max_sal) profile.salaryRange = data.min_sal + "-" + data.max_sal + " Lakhs"
                    }
                    return profile;
                  });

                  return res.json({
                    countData,
                    rating,
                    applicantData,
                    screeningRatio,
                    shortlistingRatio,
                    upcomingOfferData,
                    upcomingInterviewData,
                    newProfileData
                  });
                });
              } // End Checking if any job is allocated today or not
            });
        })
      // Calculating Screening ratio

    });
  })
  .catch(err => handleError(res, 500, err));
}

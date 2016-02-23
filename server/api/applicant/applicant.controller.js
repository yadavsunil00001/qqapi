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
import {Applicant, Resume, ApplicantState, QueuedTask, Solr, Job, Email, PhoneNumber, Experience,
  JobApplication, ApplicantDownload, ApplicantSkill, User } from '../../sqldb';
import buckets from './../../config/buckets';
import stakeholders from './../../config/stakeholders';
import phpSerialize from './../../components/php-serialize';
import config from './../../config/environment';
var util = require('util');
var formidable = require('formidable');
var fs = require('fs');
var mkdirp = require('mkdirp');

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
        id: req.params.id
      },
      include: [{
        model: ApplicantState
      },{
        model: Job
      }]
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Applicant in the DB
export function create(req, res) {
  console.log(req.body);
  // parse a file upload
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
   req.body = JSON.parse(fields.payload);
  console.log(req.body);
    // TODO Validatio for email id and phone number for same job
    Applicant.create(req.body)
      .then(function tempName(rows){
        let generatedResponseId = rows.dataValues.id;
        let rootFolderName = config.QDMS_PATH+"/Applicants/"+(generatedResponseId - (generatedResponseId % 10000))+"/"+generatedResponseId+"/";
        let fileName = files.fileUpload.name;
        fs.readFile(files.fileUpload.path, function (err, data) {
          if(err){return res.json({err:err,desc:"read"});}
          mkdirp(rootFolderName, function (err) {
            if (err) return res.json(err);
            let fileExtension = fileName.split(".").pop();
            //doc, .docx, .pdf, .rtf or .txt
            let allowedExtType = ['doc', 'docx', 'pdf', 'rtf','txt'];
            // TODO Discuss on file type saving logic
            if(allowedExtType.indexOf(fileExtension) === -1){
              return res.json("File Type Not Allowed");
            }
            let finalFileName = rootFolderName+generatedResponseId+"."+fileExtension;
            fs.writeFile(finalFileName, data, function (err) {
              if(err){
                return res.json({err:err,desc:"write"})
              }

              // Generating Data to Insert Into Resume table Starts Here
              let resumeData = {
                applicant_id : generatedResponseId,
                contents: 'Please wait the file is under processing',
                path : 'Applicant/'+(generatedResponseId - (generatedResponseId % 10000))/+'/'+generatedResponseId+'/'+generatedResponseId
              };
              Resume.create(resumeData)
              .then(function(){
               console.log("Entry added in resume");
              })
              .catch(handleError(res));
              // Generating Data to Insert Into Resume table Starts Here

              // Generating Data to Insert Into ApplicantState table Starts Here
              let applicantStateData = {
                applicant_id : generatedResponseId,
                user_id: req.user.id,
                state_id : '1'
              };
              ApplicantState.create(applicantStateData)
                .then(function(){
                 console.log("Entry added in applicant state table");
                })
                .catch(handleError(res));
              // Generating Data to Insert Into ApplicantState table Starts Here

              // TODO Remove Hardcoded
              // Generating Data to Insert Into Email table Starts Here
              let emailData = {
                applicant_id : generatedResponseId,
                email: 'dhruv@quetzal.in',
              };
              Email.create(emailData)
                .then(function(){
                  console.log("Entry added in Email state table");
                })
                .catch(handleError(res));
              // Generating Data to Insert Into Email table Starts Here


              // Generating Data to Insert Into PhoneNumber table Starts Here
              let phoneNumberData = {
                applicant_id : generatedResponseId,
                number: 9757053090,
              };
              PhoneNumber.create(phoneNumberData)
                .then(function(){
                  console.log("Entry added in PhoneNumber state table");
                })
                .catch(handleError(res));
              // Generating Data to Insert Into PhoneNumber table Starts Here

              // Generating Data to Insert Into JobApplication table Starts Here
              let jobApplicationData = {
                applicant_id : generatedResponseId,
                job_id: '1111',
              };
              JobApplication.create(jobApplicationData)
                .then(function(){
                  console.log("Entry added in JobApplication state table");
                })
                .catch(handleError(res));
              // Generating Data to Insert Into JobApplication table Starts Here

              // TODO Remove Hardcoded values
              // Generating Data to Insert Into Experience table Starts Here
              let experienceData = {
                applicant_id : generatedResponseId,
                employer_id: 11,
                designation_id : 22,
                region_id: 33,
                salary: 44.33
              };
              Experience.create(experienceData)
                .then(function(){
                  return res.json("Entry added in Experience table");
                })
                .catch(handleError(res));
              // Generating Data to Insert Into Experience table Starts Here


              //return res.json({fields: fields, files: files});
            });
          });

        });

        console.log(rootFolderName);

        //return res.json(generatedResponseId);
      })
      .catch(handleError(res));
    //res.writeHead(200, {'content-type': 'text/plain'});
    //res.write('received upload:\n\n');

  });

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
        id: req.params.id
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


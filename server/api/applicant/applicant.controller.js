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
import db, {Applicant, Resume, ApplicantState, QueuedTask, Solr, Job, Email, PhoneNumber, Experience,
  JobApplication, ApplicantDownload, ApplicantSkill, User, Client, Welcome, STAKEHOLDERS, BUCKETS } from '../../sqldb';
import phpSerialize from './../../components/php-serialize';
import config from './../../config/environment';
import util from 'util';
import formidable from 'formidable';
import fs from 'fs';
import mkdirp from 'mkdirp';
import moment from 'moment';


function handleError(res, statusCode, err) {
  console.log("Error: handleError >",err)
  statusCode = statusCode || 500;
  res.status(statusCode).send(err);
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
  const bucket = BUCKETS[STAKEHOLDERS[req.user.group_id]];
  const states = [];
  rawStates.forEach(function boostStates(state, sIndex) {
    // add weight to each state depending on positon in state array
    if (isNaN(state) && bucket[state]) {
      const bucketLength = bucket[state].length
      bucket[state].forEach((s, i) => states.push(`${s}^=${bucketLength - i}`));
    }

    if (_.isInteger(state) || ~bucket.ALL.indexOf(Number(state))) {
      states.push(`${state}^=${bucketLength - sIndex}`);
    }
  });
  //rawStates.forEach(function normalize(state) {
  //  if (isNaN(state)) if (bucket[state]) bucket[state].map(s => states.push(s));
  //
  //  if (_.isInteger(state) || ~bucket.ALL.indexOf(Number(state))) states.push(Number(state));
  //});
  //var solrQuery = solr.createQuery().q('({!child of="type_s:job"}owner_id:' + clientId +
//      ') AND type_s:applicant AND ' + stateParam).fl(fl).sort({_root_: 'DESC', type_s: 'DESC'}).start(start).rows(rows);

  const solrQuery = Solr.createQuery()
    .q(`state_id:(${states.map(s => s).join(' ')})`)
    .matchFilter(
      encodeURIComponent('type_s'),
      `applicant AND (owner_id:${req.user.id})`
    )
    //.q('(owner_id:' + req.user.id +') AND type_s:applicant ')
    //// {!child of="type_s:job"}
    //.sort({_root_: 'DESC', type_s: 'DESC'})
    //.matchFilter('state_id', `(${states.join(' OR ')})`)
    .fl(fl)
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
    var applicants = result.response.docs
    if(!applicants.length) return res.json(applicants)
    if (!~fl.indexOf('_root_')) return res.json(applicants);

    const solrInnerQuery = db.Solr
      .createQuery()
      .q(`id:(${(_.uniq(applicants.map(a => a._root_))).join(' OR ')}) AND type_s:job`)
      .fl(['role', 'id','client_name',])
      .rows(applicants.length);

    // Get job to attach to results
    db.Solr.get('select', solrInnerQuery, function solrJobCallback(jobErr, result) {
      if(jobErr) return handleError(res,500,job);
      const jobs = result.response.docs;
      if(!jobs.length) res.json(result.response.docs)
      applicants.forEach(function attachJob(applicant, key) {

        applicants[key]._root_ = jobs
          .filter(s => s.id === applicants[key]._root_)[0];
      });
      //console.log(applicants);
      res.json(applicants);
    });
  });
}

// bulkResumeDownload For Applicant
export function bulkResumeDownload(req, res){
  Resume
    .findAll({
      attributes: [['applicant_id', 'name'], 'path'],
      where: {
        applicant_id: req.query.ids.split(','),
      },
    })
    .then(function sendResume(resumeModels) {
      const resumes = resumeModels.map(resume => {
        let path = `${config.QDMS_PATH}${resume.path}`;
        if (concat) {
          path = `${path.substring(0, path.lastIndexOf('/') + 1)}concat.pdf`;
        }

        return {
          path,
          name: `${resume.get('name')}.pdf`,
        };
      });

      // Set zip file name
      let filename = req.query.id.split(',').join('_');
      filename = concat ? `${filename}_concat` : filename;
      res.zip(resumes, `${filename}.zip`);
    })
    .catch(err => handleError(res,500,err));
};

// Gets a single Applicant from the DB
export function show(req, res) {
  const fl = req.query.fl || [
      'name', 'id', 'applicant_score', 'state_name', 'state_id',
      'email', 'total_exp', 'skills', 'edu_degree', 'exp_salary',
      'exp_designation', 'exp_employer', 'email', 'notice_period',
      'mobile', 'exp_location', 'expected_ctc',
    ].join(',');

  const states = BUCKETS[STAKEHOLDERS[req.user.group_id]].ALL;

  const solrQuery = Solr.createQuery()
    .q(`type_s:applicant`)
    .matchFilter('id', `${req.params.id}`)
    .fl(fl);

  Solr.get('select', solrQuery, function solrCallback(err, result) {
    if (err) return handleError(res, 500,err);
    if (result.response.docs.length === 0) return handleError(res, 404,new Error('Applicant Not Found'));

    if (!~fl.indexOf('_root_')) return res.json(result.response.docs[0]);
    const applicant = result.response.docs[0]; console.log(result.response.docs)
    const solrInnerQuery = db.Solr
      .createQuery()
      .q(`id:${applicant._root_} AND type_s:job`)
      .fl(['role', 'id','client_name',])
      .rows(1);

    // Get job to attach to results
    db.Solr.get('select', solrInnerQuery, function solrJobCallback(jobErr, result) {

      if(jobErr) return handleError(res,500,jobErr);
      const job = result.response.docs[0];
      if(!job) return res.json(applicant)
      applicant._root_ = job
      res.json(applicant);
    });
  });
};



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
    .catch(err => handleError(res,500,err));
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
    .catch(err => handleError(res,500,err));
}

export function getResume(req, res) {
  Resume
    .find({
      attributes: ['path'],
      where: { applicant_id: req.params.id },
      order : 'id DESC',
    })
    .then(function formatFile(resume) {
      //const resumePath = Applicant.getPreferredPath(resume.path) Feature Concat Removed
      fs.readFile(`${config.QDMS_PATH}${resume.path}`, (err, resumeFile) => {
        if(err) if(err.code=="ENOENT") return res.send("<br><br><h1 style='text-align: center'>Please wait the file is under processing...</h1>")
        if(err) return handleError(res, 500, err);
        res.contentType('application/pdf');
        res.send(resumeFile);
      });
    })
    .catch(err => handleError(res,500,err));
};

export function downloadResume(req, res) {
  JobApplication
    .find({
      where: { applicant_id: req.params.id },
      include: [
        {
          model: Applicant,
          attributes: ['name'],
          include: [
            {
              model: Resume,
              attributes: ['path'],
            },
          ],
        },
        {
          model: Job,
          attributes: ['role', 'user_id'],
        },
      ],
    })
    .then(function getClientInfo(jobApplication) {
      User.findOne({
          where: { id: jobApplication.Job.get('user_id') },
          include: [
            {
              model: Client,
              attributes: ['name'],
            },
          ],
        })
        .then(function sendResume(user) {
          const file = {
            path: `${config.QDMS_PATH}${jobApplication.Applicant.Resumes[0].get('path')}`,
            name: `${jobApplication.Applicant.get('name')}-${jobApplication.Job.get('role')}` +
            `-${user.Client.get('name')}_${moment().format('D-MM-YY')}`,
          };
          if (req.query.concat === 'true') {
            file.path = file.path
                .substring(0, file.path.lastIndexOf('/') + 1) + 'concat.pdf';
            file.name += '_concat';
          }

          file.name = `${file.name.split(' ').join('_')}.pdf`;
          res.download(file.path, file.name);
        })
        .catch(err => handleError(res,500,err));
    })
    .catch(err => handleError(res,500,err));
};

exports.changeState = function changeState(req, res, next) {
  // @todo Need to check eligibility of entity sending this post request
  // @todo Need to add applicant state id in applicant table
  db.ApplicantState
    .build(req.body)
    .set('user_id', req.user.id)
    .set('applicant_id', req.params.applicantId)
    .save()
    .then(model => {
      res.status(204).end();

      // update applicant table
      db.Applicant.find({
        where: { id: model.applicant_id },
      }).then(function(applicant){
        applicant.update({ applicant_state_id: model.id });
      })

      // @todo applicant comment uses same logic => refactor
      Promise.all([

          // j[0] => jobApplicant
          db.JobApplication.findOne({
            where: { applicant_id: model.applicant_id },
            attributes: ['job_id'],
            include: [
              {
                model: db.Applicant,
                attributes: ['name', 'user_id'],
              },
              {
                model: db.Job,
                attributes: ['role', 'user_id'],
              },
            ],
          }),

          // j[0] => state.name
          db.State.findById(model.state_id, { attributes: ['name'] }),
        ])
        .then(j => {
          // j => jobApplication
          // Update solr indexes
          db.ApplicantState.updateSolr(db.Solr, {
            job: { id: j[0].job_id }, applicant: { id: model.applicant_id },
            state: _.assign({ state_name: j[1].name }, model.toJSON()),
          });

          db.User.findAll({

              // get applicant and job related fields
              where: { id: [j[0].Applicant.user_id, j[0].Job.user_id] },
              attributes: ['id', 'name'],
              include: [
                {
                  // Get Consultant and Recruiter Clients
                  model: db.Client,
                  attributes: ['name'],
                  include: [
                    {
                      // Get engagement manager emails
                      model: db.User,
                      as: 'EngagementManager',
                      attributes: ['email_id'],
                    },
                  ],
                },
              ],
            })
            .then(user => {
              const server = 'app.quezx.com';
              const state = { name: j[1].name, comment: model.comment };
              const job = {
                id: j[0].job_id,
                role: j[0].Job.role,
                creator: user.find(u => u.id === j[0].Job.user_id),
              };
              const applicant = {
                id: model.applicant_id, name: j[0].Applicant.name,
                creator: user.find(u => u.id === j[0].Applicant.user_id),
              };

              // add notification for user
              user.map(u => {
                db.Notification
                  .build({ user_id: u.id })
                  .changeStateNotify({ state, applicant, job, server });
              });

              // Notify job recruiter EM
              db.QueuedTask.changeStateNotify({
                state, applicant, job, server,
                email: job.creator.Client.EngagementManager.email_id,
              });
            })
            .catch(logger.error);
        });

      db.QueuedTask.postChangeStateActions(model);
    })
    .catch(err => handleError(res,500,err));
};


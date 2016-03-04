/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/search              ->  index
 * POST    /api/search              ->  create
 * GET     /api/search/:id          ->  show
 * PUT     /api/search/:id          ->  update
 * DELETE  /api/search/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Degree,Region,Institute,Industry,Employer,Skill,Func,Designation,Province,Solr} from '../../sqldb';
import sequelize from 'sequelize';
import buckets from './../../config/buckets';
import stakeholders from './../../config/stakeholders';

function handleError(res, statusCode, err) {
  statusCode = statusCode || 500;
  res.status(statusCode).send(err);
}


function sequelizeSearch(model, fieldName) {
  const field = fieldName || 'name';
  return function seqSearch(req, res) {
    const options = {
      attributes: ['id', [field, 'name']],
      where: {},
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
    };

    options.where[field] = { $like: `${req.query.q}%` };

    // some tables may not have system_defined field
    if (model.attributes.system_defined) options.where.system_defined = 1;

    model.findAll(options)
      .then(function searchDone(searchResults) {
        res.json(searchResults);
      })
      .catch(err => handleError(res,500,err));
  };
};

function sequelizeSearchRegion(model, fieldName) {
  const field = fieldName || 'name';
  return function seqSearch(req, res) {
    const options = {
      attributes: ['id', [sequelize.fn('CONCAT_WS', ", ", sequelize.col('region'), sequelize.col('Province.name')), 'name']],//,'Province.name'
      where: {},
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
      include: {
        model: Province,
        attributes: []
      }
    };

    options.where[field] = { $like: `${req.query.q}%` };

    // some tables may not have system_defined field
    if (model.attributes.system_defined) options.where.system_defined = 1;

    model.findAll(options)
      .then(function searchDone(searchResults) {
        res.json(searchResults);
      })
      .catch(err => handleError(res,500,err));
  };
};

function applicantSearch(){
  return function(req,res){
    // @todo more refactor Repeated Code
    const offset = req.query.offset || 0;
    const limit = (req.query.limit > 20) ? 20 : req.query.limit || 10;
    const fl = req.query.fl || [
        'id', 'name', 'exp_designation', 'edu_degree', 'exp_salary',
        'exp_employer', 'total_exp', 'exp_location', 'state_id',
        'state_name', 'applicant_score', 'created_on', '_root_','email','mobile'
      ].join(',');

    const rawStates = (req.query.state_id) ? req.query.state_id.split(',') : ['ALL'];
    const bucket = buckets[stakeholders[req.user.group_id]];
    const states = [];
    rawStates.forEach(function normalize(state) {
      if (isNaN(state)) if (bucket[state]) bucket[state].map(s => states.push(s));

      if (_.isInteger(state) || ~bucket.ALL.indexOf(Number(state))) states.push(Number(state));
    });

    const solrQuery = Solr.createQuery()
      // Todo: Solr Mobile Number field currently not allow partial search
      .q(`owner_id:${req.user.id} AND type_s:applicant AND ( name:*${req.query.q}*  OR mobile:${req.query.q}  OR email:*${req.query.q}*  )`)
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
      if (err) return handleError(res,400,err);
      return res.json(result.response.docs);
    });
  }
}

// Gets a list of Searchs
export function index(req, res) {
  if(req.query.type){
    switch(req.query.type){
      case 'applicants':
        applicantSearch()(req,res)
        break;
      case 'degrees':
        sequelizeSearch(Degree, 'degree')(req,res)
        break;
      case 'regions':
        sequelizeSearchRegion(Region, 'region')(req,res)
        break;
      case 'institutes':
        sequelizeSearch(Institute)(req,res)
        break;
      case 'industries':
        sequelizeSearch(Industry)(req,res)
        break;
      case 'employers':
        sequelizeSearch(Employer)(req,res)
        break;
      case 'skills':
        sequelizeSearch(Skill)(req,res)
        break;
      case 'funcs':
        sequelizeSearch(Func)(req,res)
        break;
      case 'designations':
        sequelizeSearch(Designation)(req,res)
        break;
      default:
        break;
    }
  }
}


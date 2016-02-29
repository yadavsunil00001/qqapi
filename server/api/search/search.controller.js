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
import {Degree,Region,Institute,Industry,Employer,Skill,Func,Designation} from '../../sqldb';

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
      .then(function searchDone(institutes) {
        res.json({ items: institutes });
      })
      .catch(err => handleError(res,500,err));
  };
};

// Gets a list of Searchs
export function index(req, res) {
  if(req.query.type){
    switch(req.query.type){
      case 'degrees':
        sequelizeSearch(Degree, 'degree')(req,res)
        break;
      case 'regions':
        sequelizeSearch(Region, 'region')(req,res)
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


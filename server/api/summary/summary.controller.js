/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/summary              ->  index
 * POST    /api/summary              ->  create
 * GET     /api/summary/:id          ->  show
 * PUT     /api/summary/:id          ->  update
 * DELETE  /api/summary/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { User, Solr } from '../../sqldb';
const buckets = require('../../config/buckets');

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

function handleError(res, statusCode, err) {
  statusCode = statusCode || 500;
  res.status(statusCode).send(err);
}

// Get Applicant State distribution for applicant states
export function dashboard(req, res) {
  let states = buckets.CONSULTANTS.TASKS;
  if (req.query.state_id) states = req.query.state_id.split(',').map(Number);

  const solrQuery = Solr.createQuery()
    .q(`{!child of="type_s:job"}owner_id:${req.user.id} AND type_s:job`)
    .matchFilter('state_id', `(${states.join(' OR ')})`)
    .facet({
      on: true,
      field: 'state_id',
    })
    .fl('')
    .rows(0);

  Solr.get('select', solrQuery, function solrCallback(err, applicants) {
    if (err) return handleError(res, err);
    if (applicants.facet_counts.length === 0) return res.status(204).end();

    const facets = applicants.facet_counts.facet_fields.state_id;
    const response = [];

    for (let i = 0; i < facets.length; i = i + 2) {
      response[facets[i]] = Number(facets[i + 1]);
    }

    res.json(response);
  });
}

// Get Applicant State distribution for applicant states
export function pipeline(req, res, next) {
  const limit = req.query.rows ? req.query.rows : 10;
  const offset = req.query.start ? req.query.start : 0;
  let states = buckets.CLIENTS.PENDING_FEEDBACK;
  if (req.query.state_id) states = req.query.state_id.split(',').map(Number);

  const solrQuery = Solr.createQuery()
    .q(`{!child of="type_s:job"}owner_id:${req.user.id} AND type_s:job`)
    .facet({
      on: true,
      field: '_root_',
      limit,
      offset,
    })
    .matchFilter('state_id', `(${states.join(' OR ')})`)
    .fl('')
    .rows(0);

  Solr.get('select', solrQuery, function solrCallback(err, applicants) {
    if (err) return next(err);
    if (applicants.facet_counts.length === 0) return res.status(204).end();

    const facets = applicants.facet_counts.facet_fields._root_;

    const solrJobQuery = Solr.createQuery()
      .q(`type_s:job AND id:(${facets.filter(a => typeof a === 'number').join(' OR ')})`)
      .fl(['id', 'name']);

    // Get Jobs detail to attach with counts
    Solr.get('select', solrJobQuery, (errJob, jobs) => {
      if (errJob) return next(errJob);
      const response = jobs.response.docs
        .map(j => _.assign(j, { count: Number(facets(facets.indexOf(j.id) + 1)) }));

      res.json(response);
    });
  });
}

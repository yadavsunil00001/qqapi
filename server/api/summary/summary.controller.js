/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/summary              ->  index
 * POST    /api/summary              ->  create
 * GET     /api/summary/:id          ->  show
 * PUT     /api/summary/:id          ->  update
 * DELETE  /api/summary/:id          ->  destroy
 */

import _ from 'lodash';
import { Solr } from '../../sqldb';
const buckets = require('../../config/buckets');

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
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

  Solr.get('select', solrQuery, (err, applicants) => {
    if (err) return handleError(res, err);
    if (applicants.facet_counts.length === 0) return res.status(204).end();

    const facets = applicants.facet_counts.facet_fields.state_id;
    const response = [];

    for (let i = 0; i < facets.length; i = i + 2) {
      response[facets[i]] = Number(facets[i + 1]);
    }

    return res.json(response);
  });
}

// Get Applicant State distribution for applicant states
export function pipeline(req, res) {
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

  Solr.get('select', solrQuery, (err, applicants) => {
    if (err) return handleError(res, 500, err);
    if (applicants.facet_counts.length === 0) return res.status(204).end();

    const facets = applicants.facet_counts.facet_fields._root_;

    const solrJobQuery = Solr.createQuery()
      .q(`type_s:job AND id:(${facets.filter(a => typeof a === 'number').join(' OR ')})`)
      .fl(['id', 'name']);

    // Get Jobs detail to attach with counts
    return Solr.get('select', solrJobQuery, (errJob, jobs) => {
      if (errJob) return handleError(errJob);
      const response = jobs.response.docs
        .map(j => _.assign(j, { count: Number(facets(facets.indexOf(j.id) + 1)) }));

      return res.json(response);
    });
  });
}

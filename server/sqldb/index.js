/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';
const solrClient = require('solr-client');

var db = {
  Sequelize,
  Solr: solrClient.createClient(
    config.solr.host, config.solr.port,
    config.solr.core, config.solr.path
  ),
  //sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
  sequelizeQuarc: new Sequelize(
    config.quarc.database, config.quarc.username,
    config.quarc.password, config.quarc
  ),
  sequelizeQuantum: new Sequelize(
    config.quantum.database, config.quantum.username,
    config.quantum.password, config.quantum
  )
};


// Quarc - Insert models below
db.Applicant = db.sequelizeQuarc.import('../api/applicant/applicant.model');
db.Job = db.sequelizeQuarc.import('../api/job/job.model');
db.JobAllocation = db.sequelizeQuarc.import('../api/jobAllocation/jobAllocation.model');

// Quantum - Insert models below
db.User = db.sequelizeQuantum.import('../api/user/user.model');

export default db;

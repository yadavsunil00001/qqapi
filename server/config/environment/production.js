'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  quarc: {
    username: process.env.QUARC_MYSQL_USER,
    password: process.env.QUARC_MYSQL_PASS,
    database: process.env.QUARC_MYSQL_DB,
    host: process.env.QUARC_MYSQL_HOST,
    dialect: 'mysql',
    logging: false,
    timezone: '+05:30',
  },
  quantum: {
    username: process.env.QUANTUM_MYSQL_USER,
    password: process.env.QUANTUM_MYSQL_PASS,
    database: process.env.QUANTUM_MYSQL_DB,
    host: process.env.QUANTUM_MYSQL_HOST,
    dialect: 'mysql',
    logging: false,
    timezone: '+05:30',
  },
  solr: {
    host: process.env.SOLR_HOST,
    port: process.env.SOLR_PORT,
    core: process.env.SOLR_CORE,
    path: process.env.SOLR_PATH,
  },
  QDMS_PATH: process.env.QDMS_PATH,
  QDMS_PATH_WELCOME: process.env.QDMS_PATH_WELCOME,
};

'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  quarc: {
    username: process.env.QUARC_MYSQL_USER,
    password: process.env.QUARC_MYSQL_PASS,
    database: process.env.QUARC_MYSQL_DB,
    host: process.env.QUARC_MYSQL_HOST,
    dialect: 'mysql',
    logging: true,
    timezone: '+05:30',
  },
  quantum: {
    username: process.env.QUANTUM_MYSQL_USER,
    password: process.env.QUANTUM_MYSQL_PASS,
    database: process.env.QUANTUM_MYSQL_DB,
    host: process.env.QUANTUM_MYSQL_HOST,
    dialect: 'mysql',
    logging: true,
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
  OAUTH_SERVER: process.env.OAUTH_SERVER ,
  OAUTH_ENDPOINT: process.env.OAUTH_ENDPOINT ,
  ACCOUNTS_CLIENT: process.env.ACCOUNTS_CLIENT ,
  ACCOUNTS_SECRET: process.env.ACCOUNTS_SECRET ,
  HIRE_CLIENT: process.env.HIRE_CLIENT ,
  HIRE_SECRET: process.env.HIRE_SECRET ,
  HIRE_REDIRECT_URI: process.env.HIRE_REDIRECT_URI ,
  PARTNER_CLIENT: process.env.PARTNER_CLIENT ,
  PARTNER_SECRET: process.env.PARTNER_SECRET ,
  PARTNER_REDIRECT_URI: process.env.PARTNER_REDIRECT_URI ,

  // Seed database on startup
  seedDB: true,

  USER: JSON.parse(process.env.USER)

};

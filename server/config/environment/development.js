'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  quarc: {
    username: "gloryque",
    password: "intranet@quezx",
    database: "gloryque_quarc",
    host: "192.168.1.200",
    dialect: 'mysql',
    logging: true,
    timezone: '+05:30',
  },
  quantum: {
    username: "gloryque",
    password: "intranet@quezx",
    database: "gloryque_quantum",
    host: "192.168.1.200",
    dialect: 'mysql',
    logging: true,
    timezone: '+05:30',
  },
  solr: {
    host: "192.168.1.203",
    port: "8080",
    core: "jobs",
    path: "/solr",
  },

  // Seed database on startup
  seedDB: true

};

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
    username: "quantum_quarc",
    password: "Hb5=apxfa6",
    database: "gloryque_quarc",
    host: "139.162.29.130",
    dialect: 'mysql',
    logging: false,
    timezone: '+05:30',
  },
  quantum: {
    username: "quantum_quarc",
    password: "Hb5=apxfa6",
    database: "gloryque_quantum",
    host: "139.162.29.130",
    dialect: 'mysql',
    logging: false,
    timezone: '+05:30',
  },
  solr: {
    host: "139.162.28.240",
    port: "8983",
    core: "jobs",
    path: "/solr",
  }
};

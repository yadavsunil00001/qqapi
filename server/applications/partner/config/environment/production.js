'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.PORT ||
  8080,

  OAUTH_SERVER: process.env.OAUTH_SERVER ,
  OAUTH_ENDPOINT: process.env.OAUTH_ENDPOINT ,

  PARTNER_CLIENT_ID:  process.env.PARTNER_CLIENT_ID,
  PARTNER_CLIENT_SECRET:  process.env.PARTNER_CLIENT_SECRET,
  PARTNER_REDIRECT_URI:  process.env.PARTNER_REDIRECT_URI
};

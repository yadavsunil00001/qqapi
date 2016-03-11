'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // Common OAuth Server : Points to Itself(This Project)
  OAUTH_SERVER: process.env.OAUTH_SERVER ,
  OAUTH_ENDPOINT: process.env.OAUTH_ENDPOINT ,

  // PARTNER  Todo: Migrate concept to services login Instead of Third Party Login
  PARTNER_CLIENT_ID:  process.env.PARTNER_CLIENT_ID,
  PARTNER_CLIENT_SECRET:  process.env.PARTNER_CLIENT_SECRET,
  PARTNER_REDIRECT_URI:  process.env.PARTNER_REDIRECT_URI,
};

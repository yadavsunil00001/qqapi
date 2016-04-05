'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // Common OAuth Server : Points to Itself(This Project)
  OAUTH_SERVER: process.env.OAUTH_SERVER ,
  OAUTH_ENDPOINT: process.env.OAUTH_ENDPOINT ,

  // MANAGE  Todo: Migrate concept to services login Instead of Third Party Login
  MANAGE_CLIENT_ID:  process.env.MANAGE_CLIENT_ID,
  MANAGE_CLIENT_SECRET:  process.env.MANAGE_CLIENT_SECRET,
  MANAGE_REDIRECT_URI:  process.env.MANAGE_REDIRECT_URI,
};

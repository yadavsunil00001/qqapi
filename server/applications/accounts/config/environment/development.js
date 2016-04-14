'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // Common OAuth Server : Points to Itself(This Project)
  OAUTH_SERVER: process.env.OAUTH_SERVER ,
  OAUTH_ENDPOINT: process.env.OAUTH_ENDPOINT ,

  // ACCOUNTS  Todo: Migrate concept to services login Instead of Third Party Login
  ACCOUNTS_CLIENT_ID:  process.env.ACCOUNTS_CLIENT_ID,
  ACCOUNTS_CLIENT_SECRET:  process.env.ACCOUNTS_CLIENT_SECRET,
  ACCOUNTS_REDIRECT_URI:  process.env.ACCOUNTS_REDIRECT_URI,
};

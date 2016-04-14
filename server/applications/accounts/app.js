'use strict';

// Accounts OAuth Application
// This project can be easily separated from Main project by copy pasting /server/applications/accounts
// And adding express settings

module.exports = function(app){
  require('./routes')(app);
};

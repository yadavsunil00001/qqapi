'use strict';

// Partner OAuth Application
// This project can be easily separated from Main project by copy pasting /server/applications/partner
// And adding express settings

module.exports = function(app){
  require('./routes')(app);
};

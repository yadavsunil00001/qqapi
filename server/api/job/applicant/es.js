/**
 * Created by Manjesh on 07-03-2016.
 */
'use strict';
var _ = require('lodash');
var envs = require('./../../../config/local.env')
var dispatch;
_.forEach(envs, function(optionData, option) {
    var data = {};
    data[option] = typeof optionData === 'function' ? optionData() : optionData;
    _.extend(process.env, data);
});

// Set default node environment to development
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';


  // Register the Babel require hook
  require('babel-core/register');


// Export the application
module.exports = require('./test');

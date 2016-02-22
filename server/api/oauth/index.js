'use strict';

var express = require('express');
var controller = require('./oauth.controller');

var router = express.Router();

router.all('/token', controller);


module.exports = router;

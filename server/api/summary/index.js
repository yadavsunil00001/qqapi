'use strict';

var express = require('express');
var controller = require('./summary.controller');

var router = express.Router();

router.get('/dashboard', controller.dashboard);
router.get('/pipeline', controller.pipeline);

module.exports = router;

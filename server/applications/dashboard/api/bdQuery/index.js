'use strict';

var express = require('express');
var controller = require('./bdQuery.controller');

var router = express.Router();

router.get('/bdQuery', controller.index);

module.exports = router;

'use strict';

var express = require('express');
var controller = require('./applicant.controller');

var router = express.Router();

router.get('/:jobId/applicants', controller.index);
router.post('/:jobId/applicants', controller.create);

module.exports = router;

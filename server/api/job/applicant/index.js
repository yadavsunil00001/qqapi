'use strict';

var express = require('express');
var controller = require('./applicant.controller');

var router = express.Router();

router.get('/:jobId/applicants', controller.index);
router.get('/:jobId/applicants/checkAlreadyApplied', controller.alreadyApplied);
router.post('/:jobId/applicants', controller.create);
router.post('/:jobId/applicants/reapply', controller.reapply);

module.exports = router;

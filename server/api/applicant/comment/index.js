'use strict';

var express = require('express');
var controller = require('./comment.controller');

var router = express.Router();

router.get('/:applicantId/comments', controller.index);
router.post('/:applicantId/comments', controller.create);

module.exports = router;

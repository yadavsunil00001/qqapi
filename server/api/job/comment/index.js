

var express = require('express');
var controller = require('./comment.controller');

var router = express.Router();

router.get('/:jobId/comments', controller.index);
router.post('/:jobId/comments', controller.create);

module.exports = router;

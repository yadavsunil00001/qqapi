'use strict';

var express = require('express');
var controller = require('./job.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/allocationStatusNew', controller.allocationStatusNew);
router.get('/allocationStatusNewCount', controller.allocationStatusNewCount);
router.get('/:jobId', controller.show);
router.post('/:jobId/consultantResponse', controller.consultantResponse);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

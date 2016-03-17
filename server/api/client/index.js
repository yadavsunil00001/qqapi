'use strict';

var express = require('express');
var controller = require('./client.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/preferences', controller.preferences);
router.get('/dashboard', controller.dashboard);
router.get('/checkTerminationStatus', controller.checkTerminationStatus);
// :id taken from session hence using /clients/updatePreferences instead of /clients/:id/updatePreferences
router.post('/updatePreferences', controller.updatePreferences);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

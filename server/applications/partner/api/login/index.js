'use strict';

var express = require('express');
var controller = require('./login.controller');

var router = express.Router();

router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);

module.exports = router;

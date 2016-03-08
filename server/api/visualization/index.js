'use strict';

var auth = require('../../auth/auth.service');
var controller = require('./visualization.controller');
var express = require('express');
var router = express.Router();

router.get('/schools', auth.hasRole('teacher'), controller.schools);

module.exports = router;
'use strict';

var auth = require('../../auth/auth.service');
var controller = require('./visualization.controller');
var express = require('express');
var router = express.Router();

router.get('/cfa-vs-notcfa', 
	auth.hasRole('teacher'), controller.cfaVsNotcfa);

module.exports = router;

'use strict';

var auth = require('../../auth/auth.service');
var controller = require('./visualization.controller');
var express = require('express');
var router = express.Router();

router.get('/cfa-comparison/combined',
  auth.hasRole('manager'),
  controller.cfaComparison);

router.get('/cfa-comparison/:schoolId',
  auth.hasRole('teacher'),
  auth.school,
  controller.cfaComparison);

router.get('/cfa-vs-notcfa',
	auth.hasRole('teacher'), controller.cfaVsNotcfa);

module.exports = router;

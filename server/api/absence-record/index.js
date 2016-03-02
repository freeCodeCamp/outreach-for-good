'use strict';

var express = require('express');
var controller = require('./absence-record.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/',
  auth.hasRole('teacher'),
  auth.authorizeSchool('body'),
  controller.create);

router.get('/current',
  auth.hasRole('teacher'),
  controller.current);

router.get('/cur-car', 
	auth.hasRole('teacher'), 
	controller.curCAR);

router.get('/arca', 
	auth.hasRole('teacher'), 
	controller.arca);

router.get('/current/:selector',
  auth.hasRole('teacher'),
  controller.filtered);

module.exports = router;

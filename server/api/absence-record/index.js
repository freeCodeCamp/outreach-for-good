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

router.get('/current/filtered',
  auth.hasRole('teacher'),
  controller.filtered);

router.get('/current/at-risk',
  auth.hasRole('teacher'),
  controller.atRisk);

router.get('/current/chronic',
  auth.hasRole('teacher'),
  controller.chronic);

module.exports = router;

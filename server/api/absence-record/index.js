'use strict';

var express = require('express');
var controller = require('./absence-record.controller');
var listController = require('./absence-record.list.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/school/:schoolId',
  auth.hasRole('teacher'),
  auth.school,
  controller.validateCreate,
  controller.create);

router.get('/school/:schoolId/list',
  auth.hasRole('teacher'),
  auth.school,
  listController.school);

router.get('/students/:studentId',
  auth.hasRole('teacher'),
  auth.student,
  controller.student);

router.get('/current',
  auth.hasRole('teacher'),
  controller.current);

router.get('/list/current',
  auth.hasRole('teacher'),
  listController.current);

router.get('/list/current/query',
  auth.hasRole('teacher'),
  listController.query);

router.get('/list/current/at-risk',
  auth.hasRole('teacher'),
  listController.atRisk);

router.get('/list/current/chronic',
  auth.hasRole('teacher'),
  listController.chronic);

module.exports = router;

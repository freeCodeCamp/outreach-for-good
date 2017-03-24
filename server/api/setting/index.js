'use strict';

var express = require('express');
var controller = require('./setting.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',
  auth.hasRole('teacher'),
  controller.names);

router.get('/interventions',
  auth.hasRole('teacher'),
  controller.names);

router.post('/interventions',
  auth.hasRole('admin'),
  controller.create);

router.delete('/interventions/:interventionId',
  auth.hasRole('admin'),
  auth.setting,
  controller.delete);

module.exports = router;

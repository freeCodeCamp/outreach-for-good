'use strict';

var express = require('express');
var controller = require('./school.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('teacher'), controller.index);
router.get('/:schoolId', auth.hasRole('teacher'), auth.school, controller.show);

router.post('/', auth.hasRole('admin'), controller.create);

router.put('/:schoolId/archive',
  auth.hasRole('admin'),
  auth.school,
  controller.archive);

router.delete('/:schoolId',
  auth.hasRole('admin'),
  auth.school,
  controller.delete);

router.put('/:schoolId/update-triggers',
  auth.hasRole('teacher'),
  auth.school,
  controller.updateTriggers);

module.exports = router;

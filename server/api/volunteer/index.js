'use strict';

var express = require('express');
var controller = require('./volunteer.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:schoolId',
  controller.getVolunteers);

router.get('/:schoolId/overview',
  controller.getOverview);

router.put('/:schoolId/:volunteerId',
  auth.hasRole('admin'),
  controller.putVolunteer);

router.post('/:schoolId',
  auth.hasRole('admin'),
  controller.postVolunteer);

router.delete('/:schoolId/:volunteerId',
  auth.hasRole('admin'),
  controller.deleteVolunteer);

module.exports = router;

'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:userId', auth.hasRole('admin'), controller.destroy);
router.put('/:userId/role', auth.hasRole('admin'), controller.updateRole);
router.put('/:userId/assignment', auth.hasRole('admin'),
  controller.updateAssignment);

router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:userId', auth.isAuthenticated(), controller.show);

module.exports = router;

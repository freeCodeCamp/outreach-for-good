'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var router = express.Router();

var modifyUserAuth = [auth.hasRole('admin'), auth.modifyUser];

router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:userId', auth.isAuthenticated(), controller.show);

router.get('/', auth.hasRole('admin'), controller.index);

router.put('/:userId/role',
  modifyUserAuth,
  controller.validateUpdateRole,
  controller.updateRole);
router.put('/:userId/assignment',
  modifyUserAuth,
  controller.validateUpdateAssignment,
  controller.updateAssignment);

router.delete('/:userId',
  modifyUserAuth,
  controller.validateDelete,
  controller.delete);

module.exports = router;

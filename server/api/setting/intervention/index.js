'use strict';

var express = require('express');
var controller = require('./intervention-setting.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/types',
  auth.hasRole('teacher'),
  controller.types);

router.post('/types',
  auth.hasRole('admin'),
  controller.create);

router.delete('/types/:typeId',
  auth.hasRole('admin'),
  controller.delete);

module.exports = router;

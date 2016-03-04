'use strict';

var auth = require('../../auth/auth.service');
var controller = require('./pdf.controller');
var express = require('express');
var router = express.Router();

router.post('/',
  auth.hasRole('teacher'),
  auth.authorizeSchool('body'),
  controller.upload);

module.exports = router;

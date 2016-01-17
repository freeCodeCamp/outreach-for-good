'use strict';

var auth = require('../../auth/auth.service');
var controller = require('./dev.controller');
var express = require('express');

var router = express.Router();

router.delete('/reset', auth.hasRole('super'), controller.reset);

module.exports = router;

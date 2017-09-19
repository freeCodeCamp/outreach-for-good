'use strict';

var express = require('express');
// var auth = require('../../auth/auth.service');

var router = express.Router();

router.use('/intervention', require('./intervention'));

module.exports = router;

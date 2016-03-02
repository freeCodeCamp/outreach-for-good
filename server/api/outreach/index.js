'use strict';

var express = require('express');
var controller = require('./outreach.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole('teacher'), controller.create);
router.post('/:id/note', auth.hasRole('teacher'), controller.addNote);

module.exports = router;

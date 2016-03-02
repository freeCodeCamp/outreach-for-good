'use strict';

var express = require('express');
var controller = require('./intervention.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/current', auth.hasRole('teacher'), controller.current);
router.post('/:id/note', auth.hasRole('teacher'), controller.addNote);
router.put('/:id/action', auth.hasRole('teacher'), controller.updateAction);

module.exports = router;

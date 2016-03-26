'use strict';

var express = require('express');
var controller = require('./intervention.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole('teacher'), controller.create);
router.put('/:id/archived', auth.hasRole('teacher'), controller.updateArchived);
router.delete('/:id', auth.hasRole('teacher'), controller.delete);

router.post('/:id/note', auth.hasRole('teacher'), controller.createNote);

module.exports = router;

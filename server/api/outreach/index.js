'use strict';

var express = require('express');
var controller = require('./outreach.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole('teacher'), controller.create);
router.put('/:id/archive', auth.hasRole('teacher'), controller.toggleArchive);
router.delete('/:id', auth.hasRole('teacher'), controller.delete);

router.post('/:id/note', auth.hasRole('teacher'), controller.addNote);

module.exports = router;

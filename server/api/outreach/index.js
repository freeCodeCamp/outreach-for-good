'use strict';

var express = require('express');
var controller = require('./outreach.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole('teacher'), controller.create);
router.post('/:id/note', auth.hasRole('teacher'), controller.addNote);
router.put('/:id/toggleArchive', auth.hasRole('teacher'), controller.toggleArchive);
router.delete('/:id/delete', auth.hasRole('teacher'), controller.delOutreach);

module.exports = router;

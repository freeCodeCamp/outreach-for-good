'use strict';

var express = require('express');
var controller = require('./intervention.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('teacher'), controller.index);
router.get('/current', auth.hasRole('teacher'), controller.current);
router.post('/:id/note', auth.hasRole('teacher'), controller.addNote);
router.put('/:id/action', auth.hasRole('teacher'), controller.updateAction);

// TODO: Add role and assignment authorization checks.
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

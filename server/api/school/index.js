'use strict';

var express = require('express');
var controller = require('./school.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('teacher'), controller.index);
router.get('/students', auth.hasRole('manager'), controller.students);
// TODO: Add "assignment" authorization check.
router.get('/:id', auth.hasRole('teacher'), controller.show);
router.get('/:id/students', auth.hasRole('teacher'), controller.students);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;

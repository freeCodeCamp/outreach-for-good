'use strict';

var express = require('express');
var controller = require('./absence-record.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// TODO: Add "assignment" authorization checks.

router.get('/', auth.hasRole('manager'), controller.index);
router.get('/by-school', controller.bySchool);
router.get('/:id', auth.hasRole('teacher'), controller.show);
router.post('/:schoolId', auth.hasRole('teacher'), controller.create);
router.put('/:id', auth.hasRole('teacher'), controller.update);
router.patch('/:id', auth.hasRole('teacher'), controller.update);
router.delete('/:id', auth.hasRole('teacher'), controller.destroy);

module.exports = router;

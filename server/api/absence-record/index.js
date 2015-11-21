'use strict';

var express = require('express');
var controller = require('./absence-record.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('manager'), controller.index);
router.get('/:id', auth.hasRole('teacher'), controller.show);
router.put('/:id', auth.hasRole('teacher'), controller.update);
router.patch('/:id', auth.hasRole('teacher'), controller.update);
router.delete('/:id', auth.hasRole('teacher'), controller.destroy);

router.post('/',
  auth.hasRole('teacher'),
  auth.schoolAuth('body'),
  controller.create);

module.exports = router;

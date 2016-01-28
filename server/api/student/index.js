'use strict';


var express = require('express');
var controller = require('./student.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('manager'), controller.index);

// CurrentSchool authorization in controller
router.get('/:id', auth.hasRole('teacher'), controller.show);
router.put('/:id/iep', auth.hasRole('teacher'), controller.updateIEP);
router.put('/:id/cfa', auth.hasRole('teacher'), controller.updateCFA);

/**
 * TODO: LOCK DOWN ROUTES WITH AUTH ROLE CHECKS
 */
router.post('/', controller.create);
router.delete('/:id', controller.destroy);

module.exports = router;

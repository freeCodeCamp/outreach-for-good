'use strict';


var express = require('express');
var controller = require('./student.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('manager'), controller.index);

/**
 * TODO: LOCK DOWN ROUTES WITH AUTH ROLE CHECKS
 */
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

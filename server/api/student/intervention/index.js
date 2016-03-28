'use strict';

var express = require('express');
var controller = require('./intervention.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router({mergeParams: true});
var authorize = [auth.hasRole('teacher'), auth.student];

router.get('/', authorize, controller.index);
router.post('/', authorize, controller.create);
router.put('/:interventionId/archived', authorize, controller.updateArchived);
router.delete('/:interventionId', authorize, controller.delete);

router.post('/:interventionId/note', authorize, controller.createNote);

module.exports = router;

'use strict';

var express = require('express');
var controller = require('./outreach.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router({mergeParams: true});
var authorize = [auth.hasRole('teacher'), auth.student];

router.get('/', authorize, controller.index);
router.post('/:outreachId/note', authorize, controller.addNote);
router.put('/:outreachId/action', authorize, controller.updateAction);

module.exports = router;

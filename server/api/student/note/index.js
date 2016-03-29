'use strict';

var express = require('express');
var controller = require('./note.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router({mergeParams: true});
var authorize = [auth.hasRole('teacher'), controller.auth];

router.get('/', authorize, controller.index);
router.get('/:noteId', authorize, controller.show);
router.post('/', authorize, controller.create);
router.put('/:noteId', authorize, controller.update);
router.delete('/:noteId', authorize, controller.destroy);


module.exports = router;

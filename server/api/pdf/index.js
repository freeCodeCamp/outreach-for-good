'use strict';

var auth = require('../../auth/auth.service');
var controller = require('./pdf.controller');
var express = require('express');
var multer = require('multer');
var router = express.Router();
var storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({storage: storage});

// NOTE: The upload middleware must come before school auth or body is empty.
router.post('/',
  auth.hasRole('teacher'),
  upload.single('file'),
  auth.schoolAuth('body'),
  controller.upload);

module.exports = router;

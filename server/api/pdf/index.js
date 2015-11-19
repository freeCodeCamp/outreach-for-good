'use strict';

var express = require('express');
var controller = require('./pdf.controller');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage });

var router = express.Router();

router.post('/', upload.single('file'), controller.upload);

module.exports = router;
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SchoolSchema = new Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('School', SchoolSchema);

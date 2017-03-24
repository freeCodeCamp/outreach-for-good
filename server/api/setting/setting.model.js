'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InterventionSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true, default: ''}
});

var SettingSchema = new Schema({
  option: {type: InterventionSchema, required: true}
});

module.exports = mongoose.model('Setting', SettingSchema);

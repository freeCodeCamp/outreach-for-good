'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingSchema = new Schema({
  name         : {type: String, required: true, default: 'settings'},
  intervention : {
    types : [{
      title       : {type: String, required: true},
      description : {type: String, required: true, default: ''},
      active      : {type: String, required: true, default: true}
    }]
  }});

module.exports = mongoose.model('setting', SettingSchema);

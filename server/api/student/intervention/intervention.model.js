'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var InterventionSchema = new Schema({
  type: {type: String, required: true},

  archived: {type: Boolean, required: true, default: false},

  student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
  withdrawn: {type: Boolean, default: false},
  school: {type: Schema.Types.ObjectId, ref: 'School', required: true},

  createdDate: {type: Date, required: true, default: Date.now},

  notes: [{
    note: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type: Date, required: true, default: Date.now}
  }]
});

module.exports = mongoose.model('Intervention', InterventionSchema);

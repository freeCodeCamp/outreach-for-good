'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var types = ['Phone', 'Letter', 'Home', 'SST', 'Court'];

var InterventionSchema = new Schema({
  student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
  school: {type: Schema.Types.ObjectId, ref: 'School', required: true},
  record: {type: Schema.Types.ObjectId, ref: 'AbsenceRecord', required: true},
  type: {type: String, required: true, enum: types},

  status: {type: String, required: true},
  statusLog: [{
    oldStatus: {type: String},
    newStatus: {type: String, required: true},
    date: {type: Date, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
  }],

  notes: [{
    note: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
  }]
});

module.exports = mongoose.model('Intervention', InterventionSchema);

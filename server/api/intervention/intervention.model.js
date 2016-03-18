'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var types = [
  'Phone Call',
  'Letter Sent',
  'Home Visit',
  'SST Referral',
  'Court Referral'
];

var InterventionSchema = new Schema({
  type: {type: String, required: true, enum: types},
  tier: {type: Number, required: true},
  absences: {type: Number, required: true},

  student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
  school: {type: Schema.Types.ObjectId, ref: 'School', required: true},

  record: {type: Schema.Types.ObjectId, ref: 'AbsenceRecord', required: true},
  schoolYear: {type: String, required: true},
  triggerDate: {type: Date, required: true},

  actionDate: {type: Date},
  notes: [{
    note: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type: Date, required: true, default: Date.now}
  }]
});

module.exports = mongoose.model('Intervention', InterventionSchema);

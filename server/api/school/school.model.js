'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var defaults = [{
  type: 'Phone Call',
  tier: 1,
  absences: 3
}, {
  type: 'Letter Sent',
  tier: 1,
  absences: 4
}, {
  type: 'Home Visit',
  tier: 1,
  absences: 5
}, {
  type: 'Phone Call',
  tier: 2,
  absences: 6
}, {
  type: 'Letter Sent',
  tier: 2,
  absences: 7
}, {
  type: 'Home Visit',
  tier: 2,
  absences: 8
}, {
  type: 'Phone Call',
  tier: 3,
  absences: 9
}, {
  type: 'Letter Sent',
  tier: 3,
  absences: 10
}, {
  type: 'Home Visit',
  tier: 3,
  absences: 11
}, {
  type: 'SST Referral',
  tier: 1,
  absences: 12
}, {
  type: 'Court Referral',
  tier: 1,
  absences: 15
}];

var SchoolSchema = new Schema({
  name: {type: String, required: true},
  triggers: {type: Array, default: defaults},
  active: {type: Boolean, default: true}
});

module.exports = mongoose.model('School', SchoolSchema);

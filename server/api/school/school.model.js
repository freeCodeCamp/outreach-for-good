'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AbsenceRecord = require('../absence-record/absence-record.model');
var Student = require('../student/student.model');
var User = require('../user/user.model');

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

SchoolSchema.pre('remove', function(next) {
  var self = this;
  AbsenceRecord.remove({school: self._id}).exec().then(function() {
    return Student.find({school: self._id}).exec();
  }).then(function(students) {
    return Promise.all(_.map(students, function(student) {
      return student.remove();
    }));
  }).then(function() {
    return User
      .update({assignment: self._id}, {$unset: {assignment: 1}},
        {multi: true})
      .exec();
  }).then(function() {
    next();
  }).catch(function(err) {
    return next(new Error(err));
  });
});

module.exports = mongoose.model('School', SchoolSchema);

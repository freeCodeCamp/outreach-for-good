'use strict';

// var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var AbsenceRecord = require('../absence-record/absence-record.model');
// var Student = require('../student/student.model');
// var User = require('../user/user.model');

var VolunteerSchema = new Schema({
  school    : {type: Schema.Types.ObjectId, ref: 'School'},
  lastName  : {type: String, required: true, trim: true},
  firstName : {type: String, required: true, trim: true},
  type      : {type: String, required: true, trim: true},
  child     : {type: Schema.Types.ObjectId, ref: 'Student'}
});

// SchoolSchema.pre('remove', function(next) {
//   var self = this;  // eslint-disable-line babel/no-invalid-this, consistent-this
//   AbsenceRecord.remove({school: self._id}).exec()
//   .then(function() {
//     return Student.find({school: self._id}).exec();
//   })
//   .then(function(students) {
//     return Promise.all(_.map(students, function(student) {
//       return student.remove();
//     }));
//   })
//   .then(function() {
//     return User
//       .update({assignment: self._id}, {$unset: {assignment: 1}},
//         {multi: true})
//       .exec();
//   })
//   .then(function() {
//     next();
//   })
//   .catch(function(err) {
//     return next(new Error(err));
//   });
// });

module.exports = mongoose.model('Volunteer', VolunteerSchema);

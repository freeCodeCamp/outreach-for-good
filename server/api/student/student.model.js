'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Outreach = require('./outreach/outreach.model');
var Intervention = require('./intervention/intervention.model');
var StudentNote = require('./note/note.model');

var StudentSchema = new Schema({
  studentId: {type: String, required: true, index: true},
  lastName: {type: String, required: true, trim: true},
  firstName: {type: String, required: true, trim: true},
  currentSchool: {type: Schema.Types.ObjectId, ref: 'School'},
  iep: {type: Boolean, required: true, default: false},
  cfa: {type: Boolean, required: true, default: false},
  withdrawn: {type: Boolean, required: true, default: false},
  active: {type: Boolean, default: true}
});

StudentSchema.pre('save', function(next) {
  if (!this.isNew && this.isModified('withdrawn')) {
    var promises = [
      Outreach.update({
        student: this._id
      }, {
        withdrawn: this.withdrawn
      }, {
        multi: true
      }).exec(),
      Intervention.update({
        student: this._id
      }, {
        withdrawn: this.withdrawn
      }, {
        multi: true
      }).exec()
    ];
    Promise.all(promises).then(function() {
      return next();
    }).catch(function(err) {
      return next(new Error(err));
    });
  } else {
    return next();
  }
});

StudentSchema.pre('remove', function(next) {
  var promises = [
    Outreach.find({student: this._id}).remove().exec(),
    Intervention.find({student: this._id}).remove().exec(),
    StudentNote.find({student: this._id}).remove().exec()
  ];
  Promise.all(promises).then(function() {
    return next();
  }).catch(function(err) {
    return next(new Error(err));
  });
});

module.exports = mongoose.model('Student', StudentSchema);

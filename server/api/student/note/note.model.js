'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StudentNoteSchema = new Schema({
  student: {type: Schema.Types.ObjectId, required: true, ref: 'Student'},
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  note: {type: String, required: true},
  archived: {type: Boolean, required: true, default: false}
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentNote', StudentNoteSchema);

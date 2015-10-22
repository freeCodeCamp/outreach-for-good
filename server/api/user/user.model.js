'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: {type: String, lowercase: true},
  role: {
    type: String,
    default: 'guest'
  },
  provider: String,
  google: {},
  assignment: {type: Schema.Types.ObjectId, ref: 'School'}
});

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

module.exports = mongoose.model('User', UserSchema);

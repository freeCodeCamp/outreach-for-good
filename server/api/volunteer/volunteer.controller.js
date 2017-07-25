'use strict';

var Volunteer = require('./volunteer.model');
// var debug = require('debug')('route:api:school');

/**
 */
exports.getVolunteers = function(req, res) {
  Volunteer.find({ school: req.params.schoolId })
    .populate('school', 'name')
    .exec(function(err, volunteers) {
      if(err) return handleError(res, err);
      return res.status(200).json(volunteers);
    });
};

exports.getOverview = function(req, res) {
  res.status(200).json({
    message : 'This is going to be an overview of volunteer information'
  });
};

/**
 */
exports.postVolunteer = function(req, res) {
  console.log(req.body);
  Volunteer.create(req.body, function(err, volunteer) {
    if(err) return handleError(res, err);
    return res.status(201).json(volunteer);
  });
};

exports.putVolunteer = function(req, res) {
  Volunteer.update(req.body, function(err, volunteer) {
    if(err) return handleError(res, err);
    return res.status(200).json(volunteer);
  });
};

exports.deleteVolunteer = function(req, res) {
  Volunteer.remove(req.body, function(err) {
    if(err) handleError(res, err);
    return res.status(204).send('Deleted volunteer');
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

'use strict';

var _ = require('lodash');
var AbsenceRecord = require('../absence-record/absence-record.model');
var School = require('../school/school.model');

function previousRecord(schoolId, schoolYear) {
  return AbsenceRecord
    .findOne({school: schoolId, schoolYear: schoolYear})
    .sort({date: -1})
    .populate('entries.student')
    .exec();
}

// Categorize students into update and create.
function groupByType(students, idToPrev) {
  return _.groupBy(students, function(student) {
    return student.student.studentId in idToPrev ? 'updates' : 'creates';
  });
}

function createInterventions(entry, prevEntry, school, schoolYear) {
  if (!entry.absencesDelta) return [];
  var prevTotal = prevEntry.absences || 0;
  return _(school.triggers)
    .filter(function(trigger) {
      return trigger.absences > prevTotal && trigger.absences <= entry.absences;
    })
    .map(function(trigger) {
      return {
        type: trigger.type,
        tier: trigger.tier,
        absences: trigger.absences,
        student: entry.student,
        school: school.id,
        schoolYear: schoolYear
      };
    })
    .value();
}

exports.upload = function(req, res) {
  School.findById(req.body.schoolId, function(err, school) {
    if (err) return handleError(res, err);
    previousRecord(school.id, req.body.schoolYear).then(function(prev) {
      var idToPrev = _.keyBy((prev || {}).entries, 'student.studentId');
      var record = groupByType(req.body.students, idToPrev);
      // Deltas are equal to their entry counterpart minus previous entry
      // total for students with existing records.
      _.forEach(record.updates || [], function(student) {
        var entry = student.entry;
        var prevEntry = idToPrev[student.student.studentId];
        entry.student = prevEntry.student._id;
        entry.tardiesDelta = entry.tardies - prevEntry.tardies;
        entry.absencesDelta = entry.absences - prevEntry.absences;
        entry.interventions =
          createInterventions(entry, prevEntry, school, req.body.schoolYear);
      });
      // Deltas are equal to their entry counterpart if creating new student.
      _.forEach(record.creates || [], function(student) {
        var entry = student.entry;
        entry.tardiesDelta = entry.tardies;
        entry.absencesDelta = entry.absences;
        entry.interventions =
          createInterventions(entry, {}, school, req.body.schoolYear);
      });
      record.missing = _.difference(_.keys(idToPrev),
        _.map(req.body.students, 'student.studentId'));
      record.schoolId = school.id;
      record.date = req.body.date;
      record.schoolYear = req.body.schoolYear;
      res.status(200).json(record);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

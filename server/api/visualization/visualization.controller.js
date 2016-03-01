'use strict';

var AbsenceRecord = require('../absence-record/absence-record.model');
var School = require('../school/school.model');

exports.schools = function(req, res) {
  var pipeline = [];
  if (req.user.role === 'teacher') {
    pipeline.push({
      $match: {school: req.user.assignment}
    });
  }

  pipeline.push({
    $unwind: '$entries'
  });

  pipeline.push({
    $group: {
      _id: {school: '$school', date: '$date', schoolYear: '$schoolYear'},
      absences: {$sum: '$entries.absences'},
      tardies: {$sum: '$entries.tardies'},
      count: {$sum: 1}
    }
  });

  pipeline.push({
    $group: {
      _id: '$_id.school',
      data: {
        $push: {
          date: '$_id.date',
          absences: '$absences',
          tardies: '$tardies',
          count: '$count'
        }
      }
    }
  });

  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    School.populate(results, {path: "_id", select: 'name'},
      function(err, report) {
        if (err) return handleError(res, err);
        return res.status(200).json(report);
      });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

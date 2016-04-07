'use strict';

var AbsenceRecord = require('../absence-record/absence-record.model');

function currentAbsenceRecordPipeline(user) {
  var pipeline = [];
  if (user.role === 'teacher') {
    pipeline.push({
      $match: {school: user.assignment}
    });
  }
  pipeline.push({
    $sort: {date: -1}
  });
  pipeline.push({
    $group: {
      _id: '$school',
      recordId: {$first: '$_id'},
      date: {$first: '$date'},
      school: {$first: '$school'},
      entries: {$first: '$entries'}
    }
  });
  pipeline.push({
    $unwind: '$entries'
  });
  return pipeline;
}

exports.cfaVsNotcfa = function(req, res) {
  var pipeline = currentAbsenceRecordPipeline(req.user);
  pipeline.push({
    $project: { 
      _id: 0, 
      student: '$entries.student', 
      present: '$entries.present', 
      enrolled: '$entries.enrolled',
      absences: '$entries.absences' 
    }
  }, {
    $project: {
      student: 1,
      arca: {
        $lte: [{ $divide: ['$present', '$enrolled'] }, 0.9]
      },
      ca: {
        $gte: ['$absences', 20]
      }
    }
  });
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, {
      path: 'student',
      model: 'Student',
      select: '_id currentSchool cfa withdrawn active',
      populate: {
        path:'currentSchool',
        model: 'School',
        select: '-_id name'
      }
    }, function(err, result) {
      if (err) return handleError(res, err);
      return res.status(200).json(result);
    });
  });
}

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

'use strict';

var _  = require('lodash');
var AbsenceRecord = require('../absence-record/absence-record.model');

var categoryDefaults = {
  'Normal': 0,
  'ARCA': 0,
  'CA': 0
};

var arcaCondition = {
  $cond: [{
    $lte: [{$divide: ['$entries.present', '$entries.enrolled']}, 0.9]
  }, 'ARCA', 'Normal']
};

var categorizeCondition = {
  $cond: [{$gte: ['$entries.absences', 20]}, 'CA', arcaCondition]
};

exports.cfaComparison = function(req, res) {
  var pipeline = [{
    $sort: {date: -1}
  }, {
    $group: {_id: '$school', entries: {$first: '$entries'}}
  }, {
    $unwind: '$entries'
  }, {
    $project: {
      _id: false,
      student: '$entries.student',
      category: categorizeCondition
    }
  }];
  if (req.school) {
    pipeline.unshift({
      $match: {school: req.school._id}
    });
  }
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    AbsenceRecord.populate(results, {
      path: 'student',
      model: 'Student',
      select: 'cfa withdrawn',
      match: {withdrawn: false}
    }, function(err, docs) {
      if (err) return handleError(res, err);
      res.status(200).json(_(docs)
        .groupBy('student.cfa')
        .mapValues(function(students) {
          return _(students)
            .groupBy('category')
            .mapValues('length')
            .defaults(categoryDefaults)
            .value();
        })
        .mapKeys(function(value, key) {
          return key === 'true' ? 'cfa' : 'non';
        })
        .value());
    });
  });
};

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
        $and: [
          { $lte: [{ $divide: ['$present', '$enrolled'] }, 0.9] },
          { $lte: ['$absences', 19] }
        ]
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

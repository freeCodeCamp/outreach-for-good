'use strict';

var _ = require('lodash');
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
    $group: {
      _id: '$school', 
      entries: {$first: '$entries'} , 
      missingEntries: {$first: '$missingEntries'}
    }
  }, {
    $project: {
      entries: {$setUnion: ['$entries', '$missingEntries']}
    }
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

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

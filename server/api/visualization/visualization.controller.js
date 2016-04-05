'use strict';

var AbsenceRecord = require('../absence-record/absence-record.model');
// var School = require('../school/school.model');
// var Student = require('../student/student.model');
var _ = require('lodash');

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
    } , function(err, middle) {
      if (err) return handleError(res, err);
      var final = { 
        cfa: {
          arca: 0,
          ca: 0,
          other: 0
        }, 
        nonCfa: {
          arca: 0,
          ca: 0,
          other: 0
        } 
      };
      // Move to client side when ready to render...
      function counter(rec, isCfa) {
        var obj = isCfa ? 'cfa' : 'nonCfa';
        if(rec.arca) final[obj].arca++;
        if(rec.ca) final[obj].ca++;
        // Fina cleaner way to do this...
        if(rec.ca === false && rec.arca === false) final[obj].other++;
      }
      _.forEach(middle, function(record) {
        record.student.cfa ? counter(record, true) : counter(record, false);
      });
      return res.status(200).json(final);
    });
  });
}

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

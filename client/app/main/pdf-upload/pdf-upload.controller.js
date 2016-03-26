'use strict';

var app = angular.module('app');

function dateOnly(dateStr) {
  var date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function PDFUploadCtrl($scope, PDF, AbsenceRecord, Auth, School, toastr) {
  function resetState() {
    delete $scope.pending;
    delete $scope.parsedRecord;
    delete $scope.file;
    $scope.maxDate = dateOnly(Date.now());
    $scope.progress = 0;
    $scope.selected = {
      school: $scope.defaultSchool,
      date: new Date()
    };
    AbsenceRecord.current().$promise.then(function(records) {
      _.forEach(records, function(record) {
        var minDate = dateOnly(record.date);
        minDate.setDate(minDate.getDate() + 1);
        record.minDate = minDate;
      });
      $scope.records = _.keyBy(records, '_id');
    });
  }

  if (Auth.getCurrentUser().role === 'teacher') {
    $scope.defaultSchool = Auth.getCurrentUser().assignment;
  } else {
    $scope.schools = School.query();
  }
  resetState();

  $scope.hasCurrentRecord = function() {
    var selectedRecordDate =
      ($scope.records[$scope.selected.school._id] || {}).date;
    return selectedRecordDate && $scope.maxDate <= dateOnly(selectedRecordDate);
  };

  $scope.cancelUpload = resetState;

  $scope.confirmUpload = function() {
    $scope.pending = true;
    $scope.parsedRecord.date = $scope.selected.date;
    AbsenceRecord.save({}, $scope.parsedRecord, function(res) {
      resetState();
      var schoolName = res.record.school.name;
      if (res.students.length) {
        toastr.success(
          res.students.length + ' new students added.',
          schoolName,
          {timeOut: 10000}
        );
      }
      toastr.success(
        [
          'Absence report with',
          res.record.entries.length,
          'entries added.'
        ].join(' '),
        schoolName,
        {timeOut: 10000}
      );
    }, function(err) {
      resetState();
      console.log(err);
      toastr.error(err.data.error, {timeOut: 0, closeButton: true});
    });
  };

  // TODO: This controller is getting rather unwieldy. Some of this
  // logic should probably be moved to services to keep the controller thin.

  function groupByType(students, idToPrev) {
    return _.groupBy(students, function(student) {
      return student.student.studentId in idToPrev ? 'updates' : 'creates';
    });
  }

  function createOutreaches(entry, prevEntry, school, schoolYear) {
    if (!entry.absencesDelta) {
      return [];
    }
    var prevTotal = prevEntry.absences || 0;
    return _(school.triggers)
      .filter(function(trigger) {
        return trigger.absences > prevTotal &&
               trigger.absences <= entry.absences;
      })
      .map(function(trigger) {
        return {
          type: trigger.type,
          tier: trigger.tier,
          absences: trigger.absences,
          student: entry.student,
          school: school._id,
          schoolYear: schoolYear
        };
      })
      .value();
  }

  function completeRecord(partialRecord) {
    var school = $scope.selected.school;
    var previousRecord = $scope.records[school._id] || {};
    var idToPrev = _.keyBy(previousRecord.entries, 'student.studentId');
    var record = groupByType(partialRecord.students, idToPrev);
    _.forEach(record.updates || [], function(student) {
      var entry = student.entry;
      var prevEntry = idToPrev[student.student.studentId];
      entry.student = prevEntry.student._id;
      entry.tardiesDelta = entry.tardies - prevEntry.tardies;
      entry.absencesDelta = entry.absences - prevEntry.absences;
      entry.outreaches =
        createOutreaches(entry, prevEntry, school, partialRecord.schoolYear);
    });
    _.forEach(record.creates || [], function(student) {
      var entry = student.entry;
      entry.tardiesDelta = entry.tardies;
      entry.absencesDelta = entry.absences;
      entry.outreaches =
        createOutreaches(entry, {}, school, partialRecord.schoolYear);
    });
    record.missing = _.difference(_.keys(idToPrev),
      _.map(partialRecord.students, 'student.studentId'));
    record.schoolId = $scope.selected.school._id;
    record.schoolYear = partialRecord.schoolYear;
    record.previousRecordId = previousRecord.recordId;
    return record;
  }

  $scope.$watch('file', function(n, o) {
    if (n !== o) {
      delete $scope.parsedRecord;
      $scope.progress = 0;
      if (n) {
        var promise = PDF.parse(n);
        promise.then(function(partialRecord) {
          $scope.parsedRecord = completeRecord(partialRecord);
        }, function(err) {
          // TODO: handle errors.
          console.log(err);
        }, function(progress) {
          $scope.progress = progress;
        });
      }
    }
  });
}

app.controller('PDFUploadCtrl', PDFUploadCtrl);

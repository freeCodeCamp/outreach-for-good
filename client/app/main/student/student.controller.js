'use strict';

function StudentCtrl($scope, $state, $stateParams, AbsenceRecord, Student,
  Modal) {
  Student.get({studentId: $stateParams.studentId}, function(student) {
    $scope.student = student;
  });
  AbsenceRecord.students({selector: $stateParams.studentId}, function(records) {
    var entry = (_.first(records) || {}).entry;
    $scope.records = records;
    $scope.percentage = (entry.present / entry.enrolled * 100);
  });

  $scope.updateIEP = Student.updateIEP;
  $scope.updateCFA = Student.updateCFA;
  $scope.updateWithdrawn = Student.updateWithdrawn;

  $scope.tabs = [{
    text: 'Outreaches',
    state: 'student.outreaches'
  }, {
    text: 'Interventions',
    state: 'student.interventions'
  }, {
    text: 'Notes',
    state: 'student.notes'
  }, {
    text: 'Summary',
    state: 'student.summary'
  }];

  $scope.viewNote = function(note, type) {
    Modal.viewNote(
      type + ' Note',
      'app/main/student/modal.view-note.html',
      note);
  };
}

angular.module('app').controller('StudentCtrl', StudentCtrl);

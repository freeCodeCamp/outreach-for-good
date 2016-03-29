'use strict';

var app = angular.module('app');

function StudentCtrl($scope, $state, $stateParams, AbsenceRecord, Student,
  toastr, Modal) {
  Student.get({studentId: $stateParams.studentId}, function(student) {
    $scope.student = student;
  });
  AbsenceRecord.students({selector: $stateParams.studentId}, function(records) {
    var entry = (_.first(records) || {}).entry;
    $scope.records = records;
    $scope.percentage = (entry.present / entry.enrolled * 100);
  });

  $scope.updateIEP = function() {
    var oldValue = !$scope.student.iep;
    Student.updateIEP({
      studentId: $stateParams.studentId
    }, {
      iep: $scope.student.iep
    }, function(student) {
      $scope.student = student;
      toastr.success(
        'IEP updated to ' + student.iep,
        student.firstName + ' ' + student.lastName);
    }, function(err) {
      $scope.student.iep = oldValue;
      toastr.error(err);
    });
  };

  $scope.updateCFA = function() {
    var oldValue = !$scope.student.cfa;
    Student.updateCFA({
      studentId: $stateParams.studentId
    }, {
      cfa: $scope.student.cfa
    }, function(student) {
      $scope.student = student;
      toastr.success(
        'CFA updated to ' + student.cfa,
        student.firstName + ' ' + student.lastName);
    }, function(err) {
      $scope.student.cfa = oldValue;
      toastr.error(err);
    });
  };

  $scope.tabs = [{
    title: 'Outreaches',
    state: 'student.outreaches'
  }, {
    title: 'Interventions',
    state: 'student.interventions'
  }, {
    title: 'Notes',
    state: 'student.notes'
  }];

  $scope.viewNote = function(note, type) {
    Modal.viewNote(
      type + ' Note',
      'app/main/student/partial/modal.view-note.html',
      note);
  };
}

app.controller('StudentCtrl', StudentCtrl);

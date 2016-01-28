'use strict';

var app = angular.module('app');

function StudentCtrl($scope, $stateParams, Intervention, Student, toastr) {
  $scope.student = Student.get({id: $stateParams.id});
  $scope.datePopups = {};
  $scope.open = function(index) {
    $scope.datePopups[index] = true;
  };
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.updateActionDate = function(intervention) {
    Intervention.updateAction(
      {id: intervention._id},
      {actionDate: intervention.actionDate},
      function(res) {
        var student = res.student;
        toastr.success(
          'Action Taken successfully updated.',
          [student.firstName, student.lastName, res.type, res.tier].join(' ')
        );
      });
  };
  $scope.addNote = function(intervention) {
    if (intervention.newNote) {
      var newNote = intervention.newNote;
      delete intervention.newNote;
      Intervention.addNote(
        {id: intervention._id},
        {note: newNote},
        function(res) {
          intervention.notes.push(res.notes[res.notes.length - 1]);
          var student = res.student;
          toastr.success(
            'New note added.',
            [student.firstName, student.lastName, res.type, res.tier].join(' ')
          );
        });
    }
  };
}

app.controller('StudentCtrl', StudentCtrl);

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

  $scope.updateIEP = function() {
    var oldValue = !$scope.student.iep;
    var promise = Student.updateIEP({
      id: $scope.student._id
    }, {
      iep: $scope.student.iep
    }).$promise;
    promise.then(function() {
      toastr.success(
        'IEP updated to ' + $scope.student.iep,
        $scope.student.firstName + ' ' + $scope.student.lastName);
    }, function(err) {
      $scope.student.iep = oldValue;
      toastr.error(err);
    });
  };

  $scope.updateCFA = function() {
    var oldValue = !$scope.student.cfa;
    var promise = Student.updateCFA({
      id: $scope.student._id
    }, {
      cfa: $scope.student.cfa
    }).$promise;
    promise.then(function() {
      toastr.success(
        'CFA updated to ' + $scope.student.cfa,
        $scope.student.firstName + ' ' + $scope.student.lastName);
    }, function(err) {
      $scope.student.cfa = oldValue;
      toastr.error(err);
    });
  };
}

app.controller('StudentCtrl', StudentCtrl);

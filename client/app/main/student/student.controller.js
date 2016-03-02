'use strict';

var app = angular.module('app');

function StudentCtrl($rootScope, $scope, $stateParams, Intervention, Modal, Outreach,
  Student, toastr) {

  $scope.student = Student.get({id: $stateParams.id});
  $scope.datePopups = {};
  $scope.open = function(index) {
    $scope.datePopups[index] = true;
  };
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  // Look for another solution, only needed in add new outreach modal
  $rootScope.outreachTypes = Outreach.getTypes();
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
  $scope.addInterventionNote = function(intervention) {
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
            'New intervention note added.',
            [student.firstName, student.lastName, res.type, res.tier].join(' ')
          );
        });
    }
  };
  $scope.addOutreach = function() {
    console.log($scope.student);
    var addOutreachFn = function(model) {
      model.student = $scope.student._id;
      model.school = $scope.student.currentSchool._id;
      return Outreach.save({}, model, function(res) {
        console.log(res);
        $scope.$evalAsync(function() {
          $scope.student.outreaches.push(res);
        });
      });
    };
    Modal.form(
      'Add New Outreach',
      'app/main/student/partial/modal.add-outreach.html',
      addOutreachFn);
  };

  $scope.addOutreachNote = function(outreach) {
    if (outreach.newNote) {
      var newNote = outreach.newNote;
      delete outreach.newNote;
      Outreach.addNote(
        {id: outreach._id},
        {note: newNote},
        function(res) {
          outreach.notes.push(res.notes[res.notes.length - 1]);
          var student = res.student;
          toastr.success(
            'New outreach note added.',
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

'use strict';

var app = angular.module('app');

function StudentInterventionsCtrl($scope, $stateParams, Intervention, Modal,
  toastr) {
  Intervention.query({
    studentId: $stateParams.studentId
  }, function(interventions) {
    $scope.interventions = interventions;
  });

  $scope.createInterventionNote = function(intervention) {
    if (intervention.newNote) {
      var newNote = intervention.newNote;
      delete intervention.newNote;
      Intervention.createNote({
        studentId: $stateParams.studentId,
        interventionId: intervention._id
      }, {
        note: newNote
      }, function(res) {
        intervention.notes.push(res.notes[res.notes.length - 1]);
        var student = res.student;
        toastr.success(
          'New intervention note created.',
          [student.firstName, student.lastName, res.type, res.tier].join(' ')
        );
      });
    }
  };

  $scope.toggleInterventionArchived = function(intervention) {
    Intervention.updateArchived({
      studentId: $stateParams.studentId,
      interventionId: intervention._id
    }, {
      archived: !intervention.archived
    }, function(toggledIntervention) {
      intervention.archived = toggledIntervention.archived;
      toastr.info(
        'The ' + intervention.type + ' intervention has been ' +
        (toggledIntervention.archived ? '' : 'un') + 'archived.');
    }, function(err) {
      console.log(err);
      toastr.error(err);
    });
  };

  $scope.deleteIntervention = function(intervention) {
    var deleteFn = function(model) {
      return Intervention.remove({}, model, function() {
        _.pull($scope.interventions, model);
        toastr.warning(model.type + ' intervention has been deleted.');
      }, function(err) {
        console.log(err);
        toastr.error(err);
      });
    };
    Modal.confirmDelete(
      'Delete Intervention',
      'app/main/student/interventions/modal.delete-intervention.html',
      intervention,
      deleteFn);
  };

  $scope.menuItems = [{
    text: 'Create New Intervention',
    action: function() {
      var createInterventionFn = function(model) {
        model.student = $scope.student._id;
        model.school = $scope.student.school._id;
        return Intervention.save({}, model, function(res) {
          $scope.$evalAsync(function() {
            $scope.interventions.unshift(res);
          });
        });
      };
      Modal.form(
        'Create New Intervention',
        'app/main/student/interventions/modal.create-intervention.html',
        createInterventionFn);
    }
  }, {
    separator: true,
    text: ' Archived Interventions',
    action: function() {
      $scope.showArchived = !$scope.showArchived;
    },
    iconFn: function() {
      return $scope.showArchived ?
             'fa-check-square-o text-success' : 'fa-square-o';
    }
  }];
}

app.controller('StudentInterventionsCtrl', StudentInterventionsCtrl);

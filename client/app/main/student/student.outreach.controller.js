'use strict';

var app = angular.module('app');

function StudentOutreachesCtrl($scope, $stateParams, Outreach, toastr) {
  Outreach.query({studentId: $stateParams.studentId}, function(outreaches) {
    _.forEach(outreaches, function(outreach) {
      // Replaces dates with Date objects expected by uib-datepicker.
      outreach.triggerDate = new Date(outreach.triggerDate);
      if (outreach.actionDate) {
        outreach.actionDate = new Date(outreach.actionDate);
      }
    });
    $scope.outreaches = outreaches;
  });

  $scope.datePopups = [];
  $scope.open = function(index) {
    $scope.datePopups[index] = true;
  };
  $scope.maxDate = new Date();

  $scope.updateActionDate = function(outreach) {
    Outreach.updateAction({
      studentId: $stateParams.studentId,
      outreachId: outreach._id
    }, {
      actionDate: outreach.actionDate
    }, function(updatedOutreach) {
      var student = $scope.student;
      toastr.success(
        'Action Taken successfully updated.',
        [
          student.firstName, student.lastName,
          updatedOutreach.type, updatedOutreach.tier
        ].join(' ')
      );
    });
  };

  $scope.addOutreachNote = function(outreach) {
    if (outreach.newNote) {
      var newNote = outreach.newNote;
      delete outreach.newNote;
      Outreach.addNote({
        studentId: $stateParams.studentId,
        outreachId: outreach._id
      }, {
        note: newNote
      }, function(res) {
        outreach.notes.push(res.notes[res.notes.length - 1]);
        var student = res.student;
        toastr.success(
          'New outreach note added.',
          [student.firstName, student.lastName, res.type, res.tier].join(' ')
        );
      });
    }
  };
}

app.controller('StudentOutreachesCtrl', StudentOutreachesCtrl);

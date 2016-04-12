'use strict';

function StudentSummaryCtrl($scope, $stateParams, Outreach, Intervention,
  StudentNote) {
  Intervention.query({
    studentId: $stateParams.studentId
  }, function(interventions) {
    $scope.interventions = interventions;
  });
  Outreach.query({studentId: $stateParams.studentId}, function(outreaches) {
    $scope.outreaches = outreaches;
  });
  StudentNote.query({studentId: $stateParams.studentId}, function(notes) {
    $scope.notes = notes;
  });
}

angular.module('app').controller('StudentSummaryCtrl', StudentSummaryCtrl);

'use strict';

var app = angular.module('app');

function StudentCtrl($scope, $state, $stateParams, Student, toastr, Modal) {
  Student.get({id: $stateParams.id}, function(result) {
    _.forEach(result.somethings, function(something) {
      // Replaces actionDates with Date objects expected by uib-datepicker.
      something.triggerDate = new Date(something.triggerDate);
      if (something.actionDate) {
        something.actionDate = new Date(something.actionDate);
      }
    });
    $scope.student = result.student;
    $scope.somethings = result.somethings;
    $scope.interventions = result.interventions;
  });

  $scope.updateIEP = function() {
    var oldValue = !$scope.student.iep;
    Student.updateIEP({
      id: $scope.student._id
    }, {
      iep: $scope.student.iep
    }, function() {
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
    Student.updateCFA({
      id: $scope.student._id
    }, {
      cfa: $scope.student.cfa
    }, function() {
      toastr.success(
        'CFA updated to ' + $scope.student.cfa,
        $scope.student.firstName + ' ' + $scope.student.lastName);
    }, function(err) {
      $scope.student.cfa = oldValue;
      toastr.error(err);
    });
  };

  $scope.tabs = [{
    title: 'Somethings',
    state: 'somethings'
  }, {
    title: 'Interventions',
    state: 'interventions'
  }];

  $scope.tabs.selected =
    _.find($scope.tabs, {state: $state.$current.name}) || $scope.tabs[0];
  $state.go($scope.tabs.selected.state);

  $scope.viewNote = function(note, type) {
    Modal.viewNote(
      type + ' Note',
      'app/main/student/partial/modal.view-note.html',
      note);
  };
}

function StudentSomethingCtrl($scope, Something, toastr) {
  $scope.datePopups = [];
  $scope.open = function(index) {
    $scope.datePopups[index] = true;
  };
  $scope.maxDate = new Date();

  $scope.updateActionDate = function(something) {
    Something.updateAction(
      {id: something._id},
      {actionDate: something.actionDate},
      function(res) {
        var student = res.student;
        toastr.success(
          'Action Taken successfully updated.',
          [student.firstName, student.lastName, res.type, res.tier].join(' ')
        );
      });
  };

  $scope.addSomethingNote = function(something) {
    if (something.newNote) {
      var newNote = something.newNote;
      delete something.newNote;
      something.addNote(
        {id: something._id},
        {note: newNote},
        function(res) {
          something.notes.push(res.notes[res.notes.length - 1]);
          var student = res.student;
          toastr.success(
            'New something note added.',
            [student.firstName, student.lastName, res.type, res.tier].join(' ')
          );
        });
    }
  };
}

function StudentInterventionsCtrl($scope, Intervention, Modal, toastr) {
  $scope.createInterventionNote = function(intervention) {
    if (intervention.newNote) {
      var newNote = intervention.newNote;
      delete intervention.newNote;
      Intervention.createNote(
        {id: intervention._id},
        {note: newNote},
        function(res) {
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
      id: intervention._id
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
        _.pull($scope.student.interventions, model);
        toastr.warning(model.type + ' intervention has been deleted.');
      }, function(err) {
        console.log(err);
        toastr.error(err);
      });
    };
    Modal.confirmDelete(
      'Delete Intervention',
      'app/main/student/partial/modal.delete-intervention.html',
      intervention,
      deleteFn);
  };

  $scope.menuItems = [{
    text: 'Create New Intervention',
    action: function() {
      var createInterventionFn = function(model) {
        model.student = $scope.student._id;
        model.school = $scope.student.currentSchool._id;
        return Intervention.save({}, model, function(res) {
          $scope.$evalAsync(function() {
            $scope.interventions.unshift(res);
          });
        });
      };
      Modal.form(
        'Create New Intervention',
        'app/main/student/partial/modal.create-intervention.html',
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

app.controller('StudentCtrl', StudentCtrl);
app.controller('StudentSomethingCtrl', StudentSomethingCtrl);
app.controller('StudentInterventionsCtrl', StudentInterventionsCtrl);

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
    $scope.outreaches = result.outreaches;
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
    title: 'Outreaches',
    state: 'outreaches'
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

function StudentOutreachesCtrl($scope, Outreach, Modal, toastr) {
  $scope.createOutreachNote = function(outreach) {
    if (outreach.newNote) {
      var newNote = outreach.newNote;
      delete outreach.newNote;
      Outreach.createNote(
        {id: outreach._id},
        {note: newNote},
        function(res) {
          outreach.notes.push(res.notes[res.notes.length - 1]);
          var student = res.student;
          toastr.success(
            'New outreach note created.',
            [student.firstName, student.lastName, res.type, res.tier].join(' ')
          );
        });
    }
  };

  $scope.toggleOutreachArchived = function(outreach) {
    Outreach.updateArchived({
      id: outreach._id
    }, {
      archived: !outreach.archived
    }, function(toggledOutreach) {
      outreach.archived = toggledOutreach.archived;
      toastr.info(
        'The ' + outreach.type + ' outreach has been ' +
        (toggledOutreach.archived ? '' : 'un') + 'archived.');
    }, function(err) {
      console.log(err);
      toastr.error(err);
    });
  };

  $scope.deleteOutreach = function(outreach) {
    var deleteFn = function(model) {
      return Outreach.remove({}, model, function() {
        _.pull($scope.student.outreaches, model);
        toastr.warning('Outreach ' + model.type + ' has been deleted.');
      }, function(err) {
        console.log(err);
        toastr.error(err);
      });
    };
    Modal.confirmDelete(
      'Delete Outreach',
      'app/main/student/partial/modal.delete-outreach.html',
      outreach,
      deleteFn);
  };

  $scope.menuItems = [{
    text: 'Create New Outreach',
    action: function() {
      var createOutreachFn = function(model) {
        model.student = $scope.student._id;
        model.school = $scope.student.currentSchool._id;
        return Outreach.save({}, model, function(res) {
          $scope.$evalAsync(function() {
            $scope.outreaches.unshift(res);
          });
        });
      };
      Modal.form(
        'Create New Outreach',
        'app/main/student/partial/modal.create-outreach.html',
        createOutreachFn);
    }
  }, {
    separator: true,
    text: ' Archived Outreaches',
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
app.controller('StudentOutreachesCtrl', StudentOutreachesCtrl);

'use strict';

var app = angular.module('app');

function StudentCtrl($scope, $stateParams, Intervention, Modal, Outreach,
  Student, toastr, $filter) {

  $scope.student = Student.get({id: $stateParams.id});
  $scope.datePopups = {};
  $scope.open = function(index) {
    $scope.datePopups[index] = true;
  };
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

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

  // Interventions

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

  // Outreaches

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

  $scope.interventionAndOutreachMenuItems = [{
    text: 'Create New Outreach',
    action: function() {
      var createOutreachFn = function(model) {
        model.student = $scope.student._id;
        model.school = $scope.student.currentSchool._id;
        return Outreach.save({}, model, function(res) {
          $scope.$evalAsync(function() {
            $scope.student.outreaches.push(res);
          });
        });
      };
      Modal.form(
        'Create New Outreach',
        'app/main/student/partial/modal.create-outreach.html',
        createOutreachFn);
    }
  }];

  $scope.viewNote = function(note, student) {
    var label = 'Note for : ' + 
      student.firstName + ' ' + 
      student.lastName + ' on ' + 
      $filter('date')(note.date);
    Modal.viewNote(
      label,
      'app/main/student/partial/modal.view-note.html',
      note.note);
  };

  $scope.openNoteModule = function(newNote, student) {
    var label ='Create note for : ' + 
      student.firstName + ' ' + 
      student.lastName;
    var updateNoteField = function() {
      // Take modal text and send it to outreach note field for confirmation
    }
    Modal.addNote(
      label,
      'app/main/student/partial/modal.create-note.html',
      newNote,
      updateNoteField);
  };
}

app.controller('StudentCtrl', StudentCtrl);

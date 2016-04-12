'use strict';

function StudentNotesCtrl($scope, $stateParams, Auth, StudentNote, toastr) {
  StudentNote.query({studentId: $stateParams.studentId}, function(notes) {
    $scope.notes = notes;
  });

  $scope.createNote = function() {
    if ($scope.newNote) {
      var newNote = $scope.newNote;
      delete $scope.newNote;
      StudentNote.save({}, {
        student: $stateParams.studentId,
        user: Auth.getCurrentUser()._id,
        note: newNote
      }, function(res) {
        $scope.notes.unshift(res);
        toastr.success(
          'Note has been created.',
          $scope.student.firstName + ' ' + $scope.student.lastName);
      });
    }
  };

  $scope.viewStudentNote = function(note, type) {
    delete $scope.openedActions;
    $scope.viewNote(note, type);
  };

  $scope.toggleNoteArchived = function(note) {
    delete $scope.openedActions;
    note.archived = !note.archived;
    StudentNote.update({}, note, function(updatedNote) {
      (updatedNote.archived ? toastr.warning : toastr.info)(
        'Note has been ' + (updatedNote.archived ? '' : 'un') + 'archived.',
        $scope.student.firstName + ' ' + $scope.student.lastName);
    }, function(err) {
      note.archived = !note.archived;
      console.log(err);
      toastr.error(err);
    });
  };

  $scope.deleteNote = function(note) {
    delete $scope.openedActions;
    StudentNote.remove({}, note, function() {
      _.pull($scope.notes, note);
      toastr.error(
        'Note has been deleted.',
        $scope.student.firstName + ' ' + $scope.student.lastName);
    }, function(err) {
      console.log(err);
      toastr.error(err);
    });
  };

  $scope.toggleNoteActions = function(note) {
    if ($scope.openedActions === note) {
      delete $scope.openedActions;
    } else {
      $scope.openedActions = note;
    }
  };

  $scope.menuItems = [{
    text: ' Archived Notes',
    action: function() {
      $scope.showArchived = !$scope.showArchived;
    },
    iconFn: function() {
      return $scope.showArchived ?
             'fa-check-square-o text-success' : 'fa-square-o';
    }
  }];
}

angular.module('app').controller('StudentNotesCtrl', StudentNotesCtrl);

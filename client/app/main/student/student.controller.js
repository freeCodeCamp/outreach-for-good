'use strict';

var app = angular.module('app');

function StudentCtrl($scope, $state, $stateParams, Student, toastr, Modal) {
  Student.get({studentId: $stateParams.studentId}, function(result) {
    var entry = _.first(result.currentRecord.entries);
    $scope.student = result.student;
    $scope.percentage = (entry.present / entry.enrolled * 100);
  });

  $scope.updateIEP = function() {
    var oldValue = !$scope.student.iep;
    Student.updateIEP({
      studentId: $stateParams.studentId
    }, {
      iep: $scope.student.iep
    }, function(student) {
      $scope.student = student;
      toastr.success(
        'IEP updated to ' + student.iep,
        student.firstName + ' ' + student.lastName);
    }, function(err) {
      $scope.student.iep = oldValue;
      toastr.error(err);
    });
  };

  $scope.updateCFA = function() {
    var oldValue = !$scope.student.cfa;
    Student.updateCFA({
      studentId: $stateParams.studentId
    }, {
      cfa: $scope.student.cfa
    }, function(student) {
      $scope.student = student;
      toastr.success(
        'CFA updated to ' + student.cfa,
        student.firstName + ' ' + student.lastName);
    }, function(err) {
      $scope.student.cfa = oldValue;
      toastr.error(err);
    });
  };

  $scope.tabs = [{
    title: 'Outreaches',
    state: 'outreaches'
  }, {
    title: 'Interventions',
    state: 'interventions'
  }, {
    title: 'Notes',
    state: 'notes'
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

app.controller('StudentCtrl', StudentCtrl);
app.controller('StudentOutreachesCtrl', StudentOutreachesCtrl);
app.controller('StudentInterventionsCtrl', StudentInterventionsCtrl);
app.controller('StudentNotesCtrl', StudentNotesCtrl);

'use strict';

var app = angular.module('app');

function StudentCtrl($scope, $stateParams, Intervention, Modal, Outreach,
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
    var addOutreachFn = function(model) {
      model.student = $scope.student._id;
      model.school = $scope.student.currentSchool._id;
      return Outreach.save({}, model, function(res) {
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
  // $scope.toggleArchiveOutreach = function(outreach) {
  //   var oldValue = outreach.archived;
  //   var promise = Outreach.toggleArchive({
  //     id: outreach._id
  //   }, {
  //     archived: !(outreach.archived)
  //   }).$promise;
  //   promise.then(function(outreach) {
  //     $scope.$evalAsync(function() {
  //       var outreaches = $scope.student.outreaches
  //       outreaches.map(function(oldOutreach, i) {
  //           if(oldOutreach._id === outreach._id) {
  //             outreaches[i].archived = outreach.archived;
  //           }
  //       });
  //     });
  //     toastr.info(
  //       'The ' + outreach.type +
  //       ' outreach has been' +
  //       (outreach.archived === true ? ' archived.' : ' unarchived.'));
  //   }, function(err) {
  //     outreach.archived = oldValue;
  //     toastr.error(err);
  //   });
  // };

  $scope.toggleArchiveOutreach = function(outreach) {
      Outreach.toggleArchive({
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
    var model = outreach;
    var deleteFn = function(model) {
      Outreach.delete({id: model._id});
      var outreaches = $scope.student.outreaches;
      outreaches.forEach(function(oldOutreach) {
          if(oldOutreach._id === outreach._id) {
            outreaches = _.pull(outreaches, oldOutreach._id);
          }
      toastr.warning('Outreach ' + outreach.type +
          ' has been deleted.');
      }, function(err) {
        console.log(err);
        toastr.error(err);
      });
    };
    Modal.confirmDelete(
      'Delete Outreach',
      'app/main/student/partial/modal.delete-outreach.html',
      model,
      deleteFn);
  };
}

app.controller('StudentCtrl', StudentCtrl);

'use strict';

var app = angular.module('app');

app.factory('Modal', function($rootScope, $uibModal) {
  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the
   *     modal
   * @return {Object}            - the instance $uibModal.open() returns
   */
  function openModal(scope, modalClass, templateUrl) {
    var modalScope = $rootScope.$new();
    scope = scope || {};
    modalClass = modalClass || 'modal-default';

    angular.extend(modalScope, scope);

    return $uibModal.open({
      templateUrl: templateUrl || 'components/modal/modal.html',
      windowClass: modalClass,
      scope: modalScope
    });
  }

  // Public API here
  return {

    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex.
       * ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex.
       *     myModalFn)
       */
      delete: function(del) {
        del = del || angular.noop;

        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight
         *     to del callback
         */
        return function() {
          var args = Array.prototype.slice.call(arguments),
            name = args.shift(),
            deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: '<p>Are you sure you want to delete <strong>' + name +
                    '</strong>?</p>',
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click: function(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          deleteModal.result.then(function(event) {
            del.apply(event, args);
          });
        };
      },

      /**
       * Create a function to open a update confirmation modal (ex.
       * ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} upd - callback, ran when update is confirmed
       * @return {Function}     - the function to open the modal (ex.
       *     myModalFn)
       */
      update: function(upd) {
        upd = upd || angular.noop;

        /**
         * Open a update confirmation modal
         * @param  {String} name       - name or info to show on modal
         * @param  {String} updateType - type of update
         * @param  {String} fromValue  - value before update
         * @param  {String} toValue    - value after update
         * @param  {All}               - any additional args are passed
         *     straight to update callback
         */
        return function() {
          var args = Array.prototype.slice.call(arguments),
            name = args.shift(),
            updateType = args.shift(),
            fromValue = args.shift(),
            toValue = args.shift(),
            updateModal;

          updateModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm ' + updateType + ' Update',
              html: '<p>Are you sure you want to update <em>' + updateType +
                    '</em> from <strong>' + fromValue +
                    '</strong> to <strong>' + toValue +
                    '</strong> for <strong>' + name + '</strong>?</p>',
              buttons: [{
                classes: 'btn-warning',
                text: 'Confirm',
                click: function(e) {
                  updateModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function(e) {
                  updateModal.dismiss(e);
                }
              }]
            }
          }, 'modal-warning');

          updateModal.result.then(function(event) {
            upd.apply(event, args);
          });
        };
      },

      /**
       * Create a function to open a reset confirmation modal (ex.
       * ng-click='reset()')
       * @param  {Function} rst - callback, ran when reset is confirmed
       * @return {Function}     - the function to open the modal (ex. reset)
       */
      reset: function(rst) {
        rst = rst || angular.noop;

        /** Open a update confirmation modal */
        return function() {
          var resetModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Application Reset',
              html: '<p>Are you sure you want to reset entire application? ' +
                    '<b>ALL DATA except user data will be destroyed!</b>' +
                    '</p>',
              buttons: [{
                classes: 'btn-danger',
                text: 'Reset',
                click: function(e) {
                  resetModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function(e) {
                  resetModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          resetModal.result.then(function(event) {
            rst.apply(event);
          });
        };
      }
    },

    form: function(title, templateUrl, cb) {
      var formModal = openModal({
        modal: {
          dismissable: true,
          title: title,
          templateUrl: templateUrl,
          submitFn: function(form, model) {
            if (form.$valid) {
              cb(model).$promise.then(function() {
                formModal.close();
              }, function() {
                // TODO: Handle error from submitting form.
              });
            }
          },
          buttons: [{
            classes: 'btn-success',
            text: 'Submit',
            type: 'submit',
            click: angular.noop
          }, {
            classes: 'btn-default',
            text: 'Cancel',
            click: function(e) {
              formModal.dismiss(e);
            }
          }]
        },
        model: {}
      }, 'modal-success', 'components/modal/form-modal.html');
    }
  };
});

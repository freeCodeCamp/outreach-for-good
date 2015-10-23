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
  function openModal(scope, modalClass) {
    var modalScope = $rootScope.$new();
    scope = scope || {};
    modalClass = modalClass || 'modal-default';

    angular.extend(modalScope, scope);

    return $uibModal.open({
      templateUrl: 'components/modal/modal.html',
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
      }
    }
  };
});

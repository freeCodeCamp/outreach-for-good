'use strict';

angular.module('appApp')
  // Keep in sync with /server/config/environment/index.js
  .constant('ROLES', ['guest', 'teacher', 'manager', 'admin', 'super'])
  .factory('Role', function(ROLES) {
    return {

      /**
       * Returns if userRole sufficient for roleRequired.
       *
       * @param userRole
       * @param roleRequired
       */
      hasRole: function(userRole, roleRequired) {
        return ROLES.indexOf(userRole) >= ROLES.indexOf(roleRequired);
      }
    };
  });

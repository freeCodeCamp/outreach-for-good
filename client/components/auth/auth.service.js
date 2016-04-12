'use strict';

function Auth(User, ROLES, $cookieStore) {
  var currentUser = {};
  if ($cookieStore.get('token')) {
    currentUser = User.me();
  }

  function hasRole(userRole, roleRequired) {
    return ROLES.indexOf(userRole) >= ROLES.indexOf(roleRequired);
  }

  return {

    /**
     * Delete access token and user info
     *
     * @param  {Function}
     */
    logout: function() {
      $cookieStore.remove('token');
      currentUser = {};
    },

    /**
     * Gets all available info on authenticated user
     *
     * @return {Object} user
     */
    getCurrentUser: function() {
      return currentUser;
    },

    /**
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    isLoggedIn: function() {
      return currentUser.hasOwnProperty('role');
    },

    /**
     * Waits for currentUser to resolve before checking if user is logged in
     */
    isLoggedInAsync: function(cb) {
      if (currentUser.hasOwnProperty('$promise')) {
        currentUser.$promise.then(function() {
          cb(true);
        }).catch(function() {
          cb(false);
        });
      } else if (currentUser.hasOwnProperty('role')) {
        cb(true);
      } else {
        cb(false);
      }
    },

    /**
     * Check if a user is an at least requiredRole.
     *
     * Convenience function for checking if current user hasRole.
     *
     * @return {Boolean}
     */
    userIs: function(requiredRole) {
      return hasRole(currentUser.role, requiredRole);
    },

    /**
     * Returns if userRole sufficient for roleRequired.
     *
     * @param userRole
     * @param roleRequired
     */
    hasRole: hasRole,

    /**
     * Get auth token
     */
    getToken: function() {
      return $cookieStore.get('token');
    }
  };
}

angular.module('app')
  .constant('ROLES', ['guest', 'teacher', 'manager', 'admin', 'super'])
  .factory('Auth', Auth);

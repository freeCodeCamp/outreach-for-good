'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider,
    $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor',
  function($rootScope, $q, $cookieStore, $injector) {
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          // remove any stale tokens
          $cookieStore.remove('token');
          // Use injector to get around circular dependency.
          $injector.get('$state').go('login');
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function($rootScope, $state, Auth, Role) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (!loggedIn) {
          if (next.name !== 'login') {
            // Redirect to login if route requires auth and user not logged in
            event.preventDefault();
            $state.go('login');
          }
        } else {
          var role = Auth.getCurrentUser().role;
          if (!Role.hasRole(role, 'teacher')) {
            if (next.name !== 'access.guest') {
              // Redirect to guest state if user not at least a teacher
              event.preventDefault();
              $state.go('access.guest');
            }
          } else if (next.auth) {
            var requiredRole = next.auth.required;
            if (!Role.hasRole(role, requiredRole) &&
                next.name !== 'access.forbidden') {
              // Redirect to forbidden state if user not at a high enough role
              event.preventDefault();
              $state.go('access.forbidden', {required: requiredRole});
            }
          }
        }
      });
    });
  });

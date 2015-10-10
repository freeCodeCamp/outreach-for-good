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
    $urlRouterProvider.otherwise(function($injector) {
      $injector.get('$state').go('main');
    });

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
    // States that always bypass the authentication/authorization check.
    var bypass = ['login', 'access.forbidden', 'access.guest'];
    $rootScope.$on('$stateChangeStart', function(event, next, params) {
      // Bypass the preventDefault when authentication and authorization pass
      // http://stackoverflow.com/a/28827077/635411
      if ($rootScope.stateChangeBypass || _.contains(bypass, next.name)) {
        $rootScope.stateChangeBypass = false;
        return;
      }
      event.preventDefault();
      Auth.isLoggedInAsync(function(loggedIn) {
        if (loggedIn) {
          var role = Auth.getCurrentUser().role;
          if (!Role.hasRole(role, 'teacher')) {
            // Redirect to guest state if user not at least a teacher
            $state.go('access.guest');
          } else if (next.auth && !Role.hasRole(role, next.auth.required)) {
            // Redirect to forbidden state if user not at a high enough role
            $state.go('access.forbidden', {required: next.auth.required});
          } else {
            $rootScope.stateChangeBypass = true;
            $state.go(next, params);
          }
        } else {
          $state.go('login');
        }
      });
    });
  });

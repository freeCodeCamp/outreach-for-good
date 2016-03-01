'use strict';

var app = angular.module('app', [
  'ngAnimate',
  'ngCookies',
  'ngMessages',
  'ngResource',
  'ngSanitize',
  'ngFileUpload',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.autoResize',
  'ui.grid.edit',
  'ui.grid.exporter',
  'ui.grid.grouping',
  'ui.grid.pinning',
  'ui.grid.selection',
  'ui.router',
  'ui.select',
  'matchmedia-ng',
  'toastr',
  'highcharts-ng'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider,
  $httpProvider) {
  $urlRouterProvider.otherwise(function($injector) {
    $injector.get('$state').go('dashboard');
  });

  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('authInterceptor');
});

app.factory('authInterceptor',
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
        var $state = $injector.get('$state');
        switch (response.status) {
          case 401:
            // remove any stale tokens
            $cookieStore.remove('token');
            // Use injector to get around circular dependency.
            $state.go('login');
            break;
          case 403:
            $state.go('forbidden', {reason: response.data.reason});
            break;
        }
        return $q.reject(response);
      }
    };
  });

function roleMsg(userRole, roleRequired) {
  return 'Your current role of ' + userRole +
         ' does not meet the minimum required role of ' +
         roleRequired + ' for the requested page.';
}

app.run(function($rootScope, $state, Auth) {
  // States that always bypass the authentication/authorization check.
  var bypass = ['login', 'forbidden', 'guest'];
  $rootScope.$on('$stateChangeStart', function(event, next, params) {
    // Bypass the preventDefault when authentication and authorization pass
    // http://stackoverflow.com/a/28827077/635411
    if ($rootScope.stateChangeBypass || _.includes(bypass, next.name)) {
      $rootScope.stateChangeBypass = false;
      return;
    }
    event.preventDefault();
    Auth.isLoggedInAsync(function(loggedIn) {
      if (loggedIn) {
        var role = Auth.getCurrentUser().role;
        if (!Auth.hasRole(role, 'teacher')) {
          // Redirect to guest state if user not at least a teacher
          $state.go('guest');
        } else if (next.auth && !Auth.hasRole(role, next.auth.required)) {
          // Redirect to forbidden state if user not at a high enough role
          $state.go('forbidden', {reason: roleMsg(role, next.auth.required)});
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

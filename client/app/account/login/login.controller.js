'use strict';

angular.module('app')
  .controller('LoginCtrl', function ($scope, $window, $timeout) {
    $scope.isLoaded = false;

    $scope.$on('$viewContentLoaded', 
    	function(){
    		$timeout(function() {
    			$scope.isLoaded = true;
    		}, 500);
    	});

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });

'use strict';

var app = angular.module('app');

function AboutCtrl($scope) {
	$scope.dting = {
		'github': 'https://github.com/dting',
		'avatar': 'https://avatars0.githubusercontent.com/u/394393?v=3&s=460',
	};
	$scope.pdotsani = {
		'github': 'https://github.com/pdotsani',
		'avatar': 'https://avatars3.githubusercontent.com/u/5272252?v=3&s=460',
	};
	$scope.urls = {
		'fcc' : 'http://freecodecamp.com',
		'github-issues' : 'https://github.com/child-first-authority-fcc-project/webapp/issues'
	};
}

app.controller('AboutCtrl', AboutCtrl);

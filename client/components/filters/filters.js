'use strict';

var app = angular.module('app');

app.filter('parseString', function() {
  return function(str) {
    return str.length > 65 ? 
    	str.slice(0, 65).concat('...') : 
    	str;
  };
});
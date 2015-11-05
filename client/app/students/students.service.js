'use strict';

angular.module('app')
  .service('Students', function($http) {
    this.list = function() {
      var students = [];

      $http.get('/api/students/by-school/', {
        // Temporary param until we can get school from user model
        params: {
          school: 'School A'
        }
      }).success(function(data) {
        data.forEach(function(student) {
          students.push(student);
        });
      });

      $http.get('/api/absence-records/by-school/', {
        params: {
          school: 'School A'
        }
      }).success(function(data) {
        var tmpEntries = data.entries;
        tmpEntries.forEach(function(entry) {
          students.forEach(function(student, i) {
            if (entry.student === student._id) {
              var newObj = {};
              _.forOwn(student, function(value, key) {
                if (key !== '_id' && key !== '__v') {
                  newObj[key] = value;
                }
              });
              _.forOwn(entry, function(value, key) {
                if (key !== '_id' && key !== '__v') {
                  newObj[key] = value;
                }
              });
              students[i] = newObj;
            }
          });
        });
        console.log(students);
      });
      return students;
    };
  });

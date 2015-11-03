'use strict';

angular.module('app')
	.service('listStudents', function($http) {
		// AngularJS will instantiate a singleton by calling "new" on this function
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
			var tmpEntries = data.entries
			tmpEntries.forEach(function(entry) {
				students.forEach(function(student, i) {
					if (entry.student === student._id) {
						var newObj = {}
						for (var attr in student) {
							if (attr !== "_id" && attr !== "__v") {
								newObj[attr] = student[attr];
							}
						}
						for (var attr in entry) {
							if (attr !== "_id" && attr !== "__v") {
								newObj[attr] = entry[attr];
							}
						}
						students[i] = newObj;
					}
				});
			})
			console.log(students);
		});

		this.getStudents = function() {
			return students;
		}

	});
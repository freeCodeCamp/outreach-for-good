'use strict';

angular.module('app')
	.controller('PDFUploadCtrl', function($scope, Upload, $timeout) {
		$scope.submit = function(file) {
			file.upload = Upload.upload({
				url: '/api/pdfs/',
				data: {
					file: file
				}
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					if(response.status === 204) {
						$scope.message = 'File Uploaded!'
					} else {
						$scope.errorMessage = response.status	+ ': ' + response.statusText;
					}
					form.reset();
				});
			});
		};
	});
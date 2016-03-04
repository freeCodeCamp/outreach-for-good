'use strict';

var app = angular.module('app');

app.factory('PDF', function($q, $resource) {
  PDFJS.workerSrc = 'bower_components/pdfjs-dist/build/pdf.worker.js';

  function parsePages(pages) {
    var items = [].concat.apply([], pages);
    var students = [];
    for (var offset = 0; offset < items.length; offset += 36) {
      for (var col = 0; col < 3; col++) {
        var name = items[offset + col * 2 + 30].split(', ');
        var parsed = {};
        parsed.student = {
          lastName: name[0],
          firstName: name[1],
          studentId: items[offset + col * 2 + 31]
        };
        parsed.entry = {
          enrolled: +items[offset + col * 2 + 7],
          present: +items[offset + col * 2 + 13],
          tardies: +items[offset + col * 2 + 19],
          absences: +items[offset + col * 2 + 25]
        };
        students.push(parsed);
      }
    }
    return {
      students: students,
      schoolYear: items[1].replace(/\s/g, '')
    };
  }

  function parse(file) {
    var deferred = $q.defer();
    var reader = new FileReader();
    var counter = 0;
    reader.onload = function() {
      PDFJS.getDocument(reader.result).then(function(pdf) {
        var pages = [];
        for (var i = 0; i < pdf.numPages; i++) {
          pages.push(i);
        }
        Promise.all(pages.map(function(pageNumber) {
          return pdf.getPage(pageNumber + 1).then(function(page) {
            return page.getTextContent().then(function(textContent) {
              deferred.notify((++counter / pdf.numPages * 100).toFixed(2));
              return textContent.items.map(function(item) {
                return item.str;
              });
            });
          });
        })).then(function(pages) {
          deferred.resolve(parsePages(pages));
        });
      });
    };
    reader.readAsArrayBuffer(file);
    return deferred.promise;
  }

  return {
    save: $resource('/api/pdfs/').save,
    parse: parse
  };
});

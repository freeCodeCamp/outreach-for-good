'use strict';

var app = angular.module('app');

app.factory('PDF', function($q, $resource) {
  PDFJS.workerSrc = 'bower_components/pdfjs-dist/build/pdf.worker.js';

  /**
   * Returns a partial record that needs to be sent to the server to get
   * deltas and be organized into existing and new students.
   */
  function partialRecord(items) {
    return {
      students: _(items, 12).chunk(12).map(function(item) {
        var name = item[0].split(', ');
        return {
          student: {
            lastName: name[0],
            firstName: name[1],
            studentId: item[1]
          },
          entry: {
            enrolled: +item[3],
            present: +item[5],
            tardies: +item[7],
            absences: +item[9]
          }
        };
      }),
      schoolYear: items[11].replace(/\s/g, '')
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
          var items = [].concat.apply([], pages);
          try {
            deferred.resolve(partialRecord(items));
          } catch (e) {
            // PDF data format error.
            deferred.reject({text: items, exception: e});
          }
        }, function(err) {
          // Parsing error.
          deferred.reject({error: err});
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

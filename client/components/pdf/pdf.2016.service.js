'use strict';

function PDF2016($q, $resource) {
  PDFJS.workerSrc = 'bower_components/pdfjs-dist/build/pdf.worker.js';

  /**
   * Returns a partial record that needs to be sent to the server to get
   * deltas and be organized into existing and new students.
   * 
   * Patch for new 2016-2017 pdf format
   *
   */
  function partialRecord(items) {
    var sidMatch = new RegExp("\\(#\\d*\\)$");
    var nameFieldCapture = new RegExp("^\\d{2,}\\s(.*), (.*) [A-Z] \\(#(\\d*)\\)$");
    var students = [];

    items.forEach(function(item, idx) {
      if (sidMatch.test(item)) {
        var nameField = nameFieldCapture.exec(item);
        if(nameField !== null) {
          students.push({
            student: {
              lastName: nameField[1],
              firstName: nameField[2],
              studentId: nameField[3]
            },
            entry: {
              enrolled: items[idx + 1], // Membership
              absences: items[idx + 2], // Absent Days
              present: items[idx + 3], // Present Days
              // ADM: items[idx + 4], uncomment if needed
              // ADA: items[idx + 5], uncomment if needed
              tardies: items[idx + 6] // unexcused Days
            }
          });
        }
      }
    });

    return {
      students: students, 
      schoolYear: items[6].replace(/(\d{2,})-(\d{2,})/, '20$1-20$2')
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
}

angular.module('app').factory('PDF2016', PDF2016);

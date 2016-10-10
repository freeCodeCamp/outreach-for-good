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
    var sidRe = /\(#(\d+)\)$/;
    var re = /^(\d{2,2})\s(.+),\s(.+)$/g;
    var students = [];

    items.forEach(function(item, idx) {
      var capture = re.exec(item);
      if (capture) {
        var grade = capture[1];
        var lastName = capture[2];
        var sid = sidRe.exec(capture[3]);
        var firstName = sid ? capture[3].replace(sidRe, '').trim() : capture[3];
        var studentId = sid ? sid[1] : sidRe.exec(items[idx + 1])[1];
        students.push({
          student: {
            lastName: lastName,
            firstName: firstName,
            studentId: studentId
          },
          entry: {
            enrolled: items[idx + 1 + !sid], // Membership
            absences: items[idx + 2 + !sid], // Absent Days
            present: items[idx + 3 + !sid], // Present Days
            // ADM: items[idx + 4], uncomment if needed
            // ADA: items[idx + 5], uncomment if needed
            tardies: items[idx + 6 + !sid] // unexcused Days
          }
        });
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

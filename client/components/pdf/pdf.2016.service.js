'use strict';

function PDF2016($q, $resource) {
  PDFJS.workerSrc = 'bower_components/pdfjs-dist/build/pdf.worker.js';

  /**
   * Returns a partial record that needs to be sent to the server to get
   * deltas and be organized into existing and new students.
   *
   * Patch for new 2016-2017 pdf format
   * *** THIS IS NOW MODIFIED TO READ IN FROM A GRADE FIELD IN THE PDF ***
   * *** GOING TO INLINE COMMENT ALONG THE WAY SO WE CAN IMPROVE THIS ***
   */
  function partialRecord(items) {

    //items is a giant array of every row in the pdf file

    // COMMENTING OUT THE REGEX BECAUSE MY FIX DOESN'T USE THEM
    // regex to grab the student id
    // var sidRe = /\(#(\d+)\)$/;

    //regex to grab student name
    // var re = /^(\d{2,2})\s(.+),\s(.+)$/g;
    //
    var students = [];
    var year = items[13];

    // since each student record in the pdf is 14 rows, i am going to splice every 14 and build the
    // students array from each record like that
    //
    // TODO: match each entry explicitly so that if the rows are in a different order in the pdf, it
    // will correct itself
    while(items.length >= 14) {
      var studentRecord = items.splice(0, 14);

      var name = studentRecord[0].split(',');

      students.push({
        student: {
          lastName: name[0],
          firstName: name[1],
          studentId: studentRecord[1],
          grade: studentRecord[3]
        },
        entry: {
          enrolled: studentRecord[5],
          absences: studentRecord[7],
          present: studentRecord[9],
          tardies: studentRecord[11]
        }
      });
    }

    /**
     * THIS IS THE ORIGINAL WAY THAT BUILDS THE STUDENTS ARRAY
     * This loop is the old way of processing the array
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
            studentId: studentId,
            grade: 5
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
    */

    //RETURN THE STUDENTS ARRAY TO THE PARSE FUNCTION TO SEND BACK TO THE UPLOADCTRL
    return {
      students: students,
      schoolYear: year.replace(/(\d{2,})-(\d{2,})/, '20$1-20$2')
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
            //partialRecord called here
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

    //promise returned to the UploadCtrl
    return deferred.promise;
  }

  return {
    save: $resource('/api/pdfs/').save,
    parse: parse
  };
}

angular.module('app').factory('PDF2016', PDF2016);

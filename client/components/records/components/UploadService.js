import PDFJS from 'pdfjs-dist';

// PDFJS.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.bundle.js';

function parse(items) {
  var sidRe = /\(#(\d+)\)$/;
  var re = /^(\d{2,2})\s(.+),\s(.+)$/g;
  var students = [];

  items.forEach(function(item, idx) {
    var capture = re.exec(item);
    if(capture) {
      var grade = capture[1];
      var lastName = capture[2];
      var sid = sidRe.exec(capture[3]);
      var firstName = sid ? capture[3].replace(sidRe, '').trim() : capture[3];
      var studentId = sid ? sid[1] : sidRe.exec(items[idx + 1])[1];
      students.push({
        student : {
          lastName,
          firstName,
          studentId,
          grade
        },
        entry : {
          enrolled : items[idx + 1 + !sid], // Membership
          absences : items[idx + 2 + !sid], // Absent Days
          present : items[idx + 3 + !sid], // Present Days
          // ADM: items[idx + 4], uncomment if needed
          // ADA: items[idx + 5], uncomment if needed
          tardies : items[idx + 6 + !sid] // unexcused Days
        }
      });
    }
  }); //end of the items.forEach loop

  if(students.length) {
    return {
      students,
      schoolYear : items[6].replace(/(\d{2,})-(\d{2,})/, '20$1-20$2')
    };
  } else {
    throw new Error('No students found in your PDF. Try a different file.');
  }
}

export default function ParsePDF(file) {
  let promise = new Promise((resolve, reject) => {
    if(file) {
      let reader = new FileReader();
      reader.onload = () => {
        PDFJS.getDocument(reader.result).then(function(pdf) {
          var pages = [];
          for(var i = 0; i < pdf.numPages; i++) {
            pages.push(i);
          }
          Promise.all(pages.map(function(pageNumber) {
            return pdf.getPage(pageNumber + 1).then(function(page) {
              return page.getTextContent().then(function(textContent) {
                // deferred.notify((++counter / pdf.numPages * 100).toFixed(2));
                return textContent.items.map(function(item) {
                  return item.str;
                });
              });
            });
          })).then(function(pages) {
            var items = [].concat.apply([], pages);

            try {
              resolve(parse(items));
            } catch (e) {
              // PDF data format error.
              reject(e);
            }
          }, function(err) {
            // Parsing error.
            reject({error: err});
          });
        });
      };
      reader.readAsArrayBuffer(file);
    }
  });

  return promise;
}

/**
 *     if(accepted) {
       PDFJS.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.bundle.js';

       let reader = new FileReader();
       reader.onload = () => {
         PDFJS.getDocument(reader.result)
           .then(pdf => {
             let totalPages = pdf.numPages;
             for(let i = 1; i <= totalPages; i++) {
               pdf.getPage(i)
               .then(page => page.getTextContent())
               .then(text => text.items.map((each, ind) => {
                 // this.setState({pdfProgress: (ind / totalPages * 100)});
                 return each.str;
               }))
               .then(items => {
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
                         studentId: studentId,
                         grade: grade
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
                 if(students.length) {
                   return {
                     students: students,
                     schoolYear: items[6].replace(/(\d{2,})-(\d{2,})/, '20$1-20$2')
                   };
                 } else {
                   throw new Error('No students found in your PDF. Try a different file.');
                 }
               })
               .then(items => {
                 this.setState({ items });
                 console.log(this.state.items);
               });
             }
           });
       };
       reader.onload.bind(this);
       reader.readAsArrayBuffer(accepted[0]);
     }
 */

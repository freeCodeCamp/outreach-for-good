import PDFJS from 'pdfjs-dist';
import _ from 'lodash';

function groupByType(students, idKeys) {
  return _.groupBy(students, function(student) {
    return student.student.studentId in idKeys ? 'updates' : 'creates';
  });
}

function createOutreaches(entry, prevEntry, school, schoolYear) {
  if (!entry.absencesDelta) {
    return [];
  }
  var prevTotal = prevEntry.absences || 0;
  return _(school.triggers)
    .filter(function(trigger) {
      return trigger.absences > prevTotal &&
             trigger.absences <= entry.absences;
    })
    .map(function(trigger) {
      return {
        type: trigger.type,
        tier: trigger.tier,
        absences: trigger.absences,
        student: entry.student,
        school: school._id,
        schoolYear: schoolYear,
        withdrawn: !!(prevEntry.student || {}).withdrawn
      };
    })
    .value();
}

function handleSameSchoolYear(prevRecord, partialRecord, school) {
  var combinedEntries = _.concat(prevRecord.entries || [],
    prevRecord.missingEntries || []);
  var studentIdToPrevEntry = _.keyBy(combinedEntries, 'student.studentId');
  var record = groupByType(partialRecord.students, studentIdToPrevEntry);
  record.schoolYear = partialRecord.schoolYear;
  _.forEach(record.updates || [], function(update) {
    var entry = update.entry;
    var prevEntry = studentIdToPrevEntry[update.student.studentId];
    entry.student = prevEntry.student._id;
    // Updates use previous entry to calculate deltas.
    entry.tardiesDelta = entry.tardies - prevEntry.tardies;
    entry.absencesDelta = entry.absences - prevEntry.absences;
    entry.outreaches =
      createOutreaches(entry, prevEntry, school, record.schoolYear);
  });
  record.missingEntries =
    _.differenceBy(combinedEntries, partialRecord.students || [],
      'student.studentId');
  record.newMissingStudents = _(record.missingEntries || [])
    .differenceBy(prevRecord.missingEntries || [], 'student.studentId')
    .map('student._id')
    .value();
  _.forEach(record.missingEntries, function(missingEntry) {
    if (!missingEntry.date) {
      missingEntry.date = prevRecord.date;
    }
  });
  return record;
}

function handleNewSchoolYear(prevRecord, partialRecord, school) {
  var combinedEntries = _.concat(prevRecord.entries || [],
    prevRecord.missingEntries || []);
  var studentIdToId = _(combinedEntries)
    .keyBy('student.studentId')
    .mapValues('student._id')
    .value();
  var record = groupByType(partialRecord.students, studentIdToId);
  record.schoolYear = partialRecord.schoolYear;
  _.forEach(record.updates || [], function(update) {
    var entry = update.entry;
    entry.student = studentIdToId[update.student.studentId];
    // Updates deltas start over by setting to tardies and absences values.
    entry.tardiesDelta = entry.tardies;
    entry.absencesDelta = entry.absences;
    entry.outreaches = createOutreaches(entry, {}, school, record.schoolYear);
  });
  record.missingEntries = [];
  record.newMissingStudents = [];
  return record;
}

function completeRecord(school, previousRecord, partialRecord) {
  // var school = school;
  var record = partialRecord.schoolYear === previousRecord.schoolYear ?
               handleSameSchoolYear(previousRecord, partialRecord, school) :
               handleNewSchoolYear(previousRecord, partialRecord, school);
  _.forEach(record.creates || [], function(create) {
    var entry = create.entry;
    entry.tardiesDelta = entry.tardies;
    entry.absencesDelta = entry.absences;
    entry.outreaches = createOutreaches(entry, {}, school, record.schoolYear);
  });
  record.schoolId = school._id;
  record.previousRecordId = previousRecord.recordId;
  // console.log('record:', record)
  return record;
}

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

export default function ParsePDF(school, previousRecord, file) {
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
                return textContent.items.map(function(item) {
                  return item.str;
                });
              });
            });
          })).then(function(pages) {
            var items = [].concat.apply([], pages);

            try {
              let partial = parse(items);
              console.log(previousRecord);
              let complete = completeRecord(school, previousRecord, partial);
              resolve(complete);
            } catch(e) {
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

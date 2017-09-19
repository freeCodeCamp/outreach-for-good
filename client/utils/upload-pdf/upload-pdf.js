import PDFJS from 'pdfjs-dist';
import _ from 'lodash';

/**
 * Class constructor to parse the pdf file and return records and messages
 */
export default class UploadPdf {
  constructor(school, previousRecord, file) {
    this.school = school;
    this.previousRecord = previousRecord;
    this.file = file;
  }

  getRecord() {
    let promise = new Promise((resolve, reject) => {
      this._readFile(this.file, response => {
        PDFJS.getDocument(response.target.result)
          .then(pdf => {
            //handle multiple page pdfs
            let pages = [];
            for(let i = 0; i < pdf.numPages; i++) {
              pages.push(i);
            }
            return Promise.all(pages.map(pageNumber => pdf.getPage(pageNumber + 1)
              .then(page => page.getTextContent().then(textContent => textContent.items.map(item => item.str)))));
          })
          .then(allPages => {
            // let items = [].concat.apply([], allPages);
            let items = [...allPages];

            try {
              let partial = parse(items);
              let record = completeRecord(this.school, this.previousRecord, partial);
              let message = this._getMessage(record);

              resolve({ record, message });
            } catch(err) {
              reject(err);
            }
          }, err => reject(err));
      });
    });
    return promise;
  }

  _readFile(file, resultsCallback) {
    let reader = new FileReader();
    reader.onload = resultsCallback;
    reader.readAsArrayBuffer(file);
  }

  _getMessage(record) {
    let message = [];
    if(typeof record.creates !== 'undefined') {
      message.push(`${record.creates.length} students created.`);
    }

    if(typeof record.updates !== 'undefined') {
      message.push(`${record.updates.length} students updated.`);
    }

    if(typeof record.missingEntries !== 'undefined') {
      message.push(`${record.missingEntries.length} students missing from entry.`);
    }

    if(typeof record.newMissingStudents !== 'undefined') {
      message.push(`${record.newMissingStudents.length} new missing students.`);
    }

    return message.join('. ');
  }
}
/**
 * Private methods used by the PDFParser class below
 * Needs documentation
 */

function groupByType(students, idKeys) {
  return _.groupBy(students, function(student) {
    return student.student.studentId in idKeys ? 'updates' : 'creates';
  });
}

function createOutreaches(entry, prevEntry, school, schoolYear) {
  if(!entry.absencesDelta) {
    return [];
  }
  var prevTotal = prevEntry.absences || 0;
  return _(school.triggers)
    .filter(function(trigger) {
      return trigger.absences > prevTotal
        && trigger.absences <= entry.absences;
    })
    .map(function(trigger) {
      return {
        type      : trigger.type,
        tier      : trigger.tier,
        absences  : trigger.absences,
        student   : entry.student,
        school    : school._id,
        schoolYear,
        withdrawn : !!(prevEntry.student || {}).withdrawn
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
    entry.outreaches = createOutreaches(entry, prevEntry, school, record.schoolYear);
  });
  record.missingEntries = _.differenceBy(combinedEntries, partialRecord.students || [],
      'student.studentId');
  record.newMissingStudents = _(record.missingEntries || [])
    .differenceBy(prevRecord.missingEntries || [], 'student.studentId')
    .map('student._id')
    .value();
  _.forEach(record.missingEntries, function(missingEntry) {
    if(!missingEntry.date) {
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
  // TODO: If there is no previous record an error is thrown.
  var record = partialRecord.schoolYear === previousRecord.schoolYear
    ? handleSameSchoolYear(previousRecord, partialRecord, school)
    : handleNewSchoolYear(previousRecord, partialRecord, school);

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
          present  : items[idx + 3 + !sid], // Present Days
          // ADM: items[idx + 4], uncomment if needed
          // ADA: items[idx + 5], uncomment if needed
          tardies  : items[idx + 6 + !sid] // unexcused Days
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

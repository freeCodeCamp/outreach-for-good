import delay from './delay';

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
const absenceRecord = [
  {
    _id             : '589bb5ad5d4c3d03304f49c9',
    schoolYear      : '2015-2016',
    school          : '589bb5ad5d4c3d03304f49c1',
    date            : ISODate('2017-02-07T00:19:57.048Z'),
    createdStudents : [
      '589bb5ad5d4c3d03304f49c4',
      '589bb5ad5d4c3d03304f49c5',
      '589bb5ad5d4c3d03304f49c6'
    ],
    newMissingStudents : [],
    missingEntries     : [],
    entries            : [
      {
        student       : '589bb5ad5d4c3d03304f49c4',
        absences      : 1,
        absencesDelta : 1,
        tardies       : 0,
        tardiesDelta  : 0,
        present       : 15,
        enrolled      : 16,
        _id           : '589bb5ad5d4c3d03304f49cc'
      }, {
        student       : '589bb5ad5d4c3d03304f49c5',
        absences      : 1,
        absencesDelta : 1,
        tardies       : 0,
        tardiesDelta  : 0,
        present       : 14,
        enrolled      : 15,
        _id           : '589bb5ad5d4c3d03304f49cb'
      }, {
        student       : '589bb5ad5d4c3d03304f49c6',
        absences      : 1,
        absencesDelta : 1,
        tardies       : 0,
        tardiesDelta  : 0,
        present       : 21,
        enrolled      : 22,
        _id           : '589bb5ad5d4c3d03304f49ca'
      }
    ],
    __v : 0
  }, {
    _id             : '589bb5ad5d4c3d03304f49cd',
    schoolYear      : '2015-2016',
    school          : '589bb5ad5d4c3d03304f49c2',
    date            : ISODate('2017-02-07T00:19:57.048Z'),
    createdStudents : [
      '589bb5ad5d4c3d03304f49c7',
      '589bb5ad5d4c3d03304f49c8'
    ],
    newMissingStudents : [],
    missingEntries     : [],
    entries            : [
      {
        student       : '589bb5ad5d4c3d03304f49c7',
        absences      : 0,
        absencesDelta : 0,
        tardies       : 0,
        tardiesDelta  : 0,
        present       : 1,
        enrolled      : 1,
        _id           : '589bb5ad5d4c3d03304f49cf'
      }, {
        student       : '589bb5ad5d4c3d03304f49c8',
        absences      : 0,
        absencesDelta : 0,
        tardies       : 0,
        tardiesDelta  : 0,
        present       : 22,
        enrolled      : 22,
        _id           : '589bb5ad5d4c3d03304f49ce'
      }
    ],
    __v : 0
  }
];

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

const generateId = absenceRecord => replaceAll(absenceRecord.title, ' ', '-');

class AbsenceRecordsApi {
  static getAllAbsenceRecords() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Object.assign([], absenceRecords));
      }, delay);
    });
  }

  static saveAbsenceRecord(absenceRecord) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate server-side validation
        const minAbsenceRecordTitleLength = 1;
        if(absenceRecord.title.length < minAbsenceRecordTitleLength) {
          reject(`Title must be at least ${minAbsenceRecordTitleLength} characters.`);
        }

        if(absenceRecord.id) {
          const existingAbsenceRecordIndex = absenceRecords.findIndex(a => a.id == absenceRecord.id);
          absenceRecords.splice(existingAbsenceRecordIndex, 1, absenceRecord);
        } else {
          //Just simulating creation here.
          //The server would generate ids and watchHref's for new absenceRecords in a real app.
          //Cloning so copy returned is passed by value rather than by reference.
          absenceRecord.id = generateId(absenceRecord);
          absenceRecord.watchHref = `http://www.pluralsight.com/absenceRecords/${absenceRecord.id}`;
          absenceRecords.push(absenceRecord);
        }

        resolve(Object.assign({}, absenceRecord));
      }, delay);
    });
  }

  static deleteAbsenceRecord(absenceRecordId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const indexOfAbsenceRecordToDelete = absenceRecords.findIndex(absenceRecord => {
          absenceRecord.absenceRecordId == absenceRecordId;
        });
        absenceRecords.splice(indexOfAbsenceRecordToDelete, 1);
        resolve();
      }, delay);
    });
  }
}

export default AbsenceRecordsApi;

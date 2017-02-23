import delay from './delay';

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
const schools = [
  {
    _id      : '589bb5ad5d4c3d03304f49c1',
    name     : 'School A',
    active   : true,
    triggers : [
      {
        absences : 3,
        tier     : 1,
        type     : 'Phone Call'
      }, {
        absences : 4,
        tier     : 1,
        type     : 'Letter Sent'
      }, {
        absences : 5,
        tier     : 1,
        type     : 'Home Visit'
      }, {
        absences : 6,
        tier     : 2,
        type     : 'Phone Call'
      }, {
        absences : 7,
        tier     : 2,
        type     : 'Letter Sent'
      }, {
        absences : 8,
        tier     : 2,
        type     : 'Home Visit'
      }, {
        absences : 9,
        tier     : 3,
        type     : 'Phone Call'
      }, {
        absences : 10,
        tier     : 3,
        type     : 'Letter Sent'
      }, {
        absences : 11,
        tier     : 3,
        type     : 'Home Visit'
      }, {
        absences : 12,
        tier     : 1,
        type     : 'SST Referral'
      }, {
        absences : 15,
        tier     : 1,
        type     : 'Court Referral'
      }
    ],
    __v : 0
  }, {
    _id      : ObjectId('589bb5ad5d4c3d03304f49c2'),
    name     : 'School B',
    active   : true,
    triggers : [
      {
        absences : 3,
        tier     : 1,
        type     : 'Phone Call'
      }, {
        absences : 4,
        tier     : 1,
        type     : 'Letter Sent'
      }, {
        absences : 5,
        tier     : 1,
        type     : 'Home Visit'
      }, {
        absences : 6,
        tier     : 2,
        type     : 'Phone Call'
      }, {
        absences : 7,
        tier     : 2,
        type     : 'Letter Sent'
      }, {
        absences : 8,
        tier     : 2,
        type     : 'Home Visit'
      }, {
        absences : 9,
        tier     : 3,
        type     : 'Phone Call'
      }, {
        absences : 10,
        tier     : 3,
        type     : 'Letter Sent'
      }, {
        absences : 11,
        tier     : 3,
        type     : 'Home Visit'
      }, {
        absences : 12,
        tier     : 1,
        type     : 'SST Referral'
      }, {
        absences : 15,
        tier     : 1,
        type     : 'Court Referral'
      }
    ],
    __v : 0
  }, {
    _id      : ObjectId('589bb5ad5d4c3d03304f49c3'),
    name     : 'School C',
    active   : true,
    triggers : [
      {
        absences : 3,
        tier     : 1,
        type     : 'Phone Call'
      }, {
        absences : 4,
        tier     : 1,
        type     : 'Letter Sent'
      }, {
        absences : 5,
        tier     : 1,
        type     : 'Home Visit'
      }, {
        absences : 6,
        tier     : 2,
        type     : 'Phone Call'
      }, {
        absences : 7,
        tier     : 2,
        type     : 'Letter Sent'
      }, {
        absences : 8,
        tier     : 2,
        type     : 'Home Visit'
      }, {
        absences : 9,
        tier     : 3,
        type     : 'Phone Call'
      }, {
        absences : 10,
        tier     : 3,
        type     : 'Letter Sent'
      }, {
        absences : 11,
        tier     : 3,
        type     : 'Home Visit'
      }, {
        absences : 12,
        tier     : 1,
        type     : 'SST Referral'
      }, {
        absences : 15,
        tier     : 1,
        type     : 'Court Referral'
      }
    ],
    __v : 0
  }
];

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

//This would be performed on the server in a real app. Just stubbing in.
const generateId = school => replaceAll(school.title, ' ', '-');

class SchoolsApi {
  static getAllSchools() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Object.assign([], schools));
      }, delay);
    });
  }

  static saveSchool(school) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate server-side validation
        const minSchoolTitleLength = 1;
        if(school.title.length < minSchoolTitleLength) {
          reject(`Title must be at least ${minSchoolTitleLength} characters.`);
        }

        if(school.id) {
          const existingSchoolIndex = schools.findIndex(a => a.id == school.id);
          schools.splice(existingSchoolIndex, 1, school);
        } else {
          //Just simulating creation here.
          //The server would generate ids and watchHref's for new schools in a real app.
          //Cloning so copy returned is passed by value rather than by reference.
          school.id = generateId(school);
          school.watchHref = '';
          schools.push(school);
        }

        resolve(Object.assign({}, school));
      }, delay);
    });
  }

  static deleteSchool(schoolId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const indexOfSchoolToDelete = schools.findIndex(school => {
          school.schoolId == schoolId;
        });
        schools.splice(indexOfSchoolToDelete, 1);
        resolve();
      }, delay);
    });
  }
}

export default SchoolsApi;

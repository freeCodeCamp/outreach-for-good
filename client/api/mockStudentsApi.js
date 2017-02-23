import delay from './delay';

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
const student = [
  {
    _id       : '589bb5ad5d4c3d03304f49c4',
    studentId : 'sid001',
    lastName  : 'Graham',
    firstName : 'Brandon',
    school    : '589bb5ad5d4c3d03304f49c1',
    active    : true,
    withdrawn : false,
    cfa       : false,
    iep       : false,
    __v       : 0
  }, {
    _id       : '589bb5ad5d4c3d03304f49c5',
    studentId : 'sid002',
    lastName  : 'Simpson',
    firstName : 'Dan',
    school    : '589bb5ad5d4c3d03304f49c1',
    active    : true,
    withdrawn : false,
    cfa       : false,
    iep       : false,
    __v       : 0
  }, {
    _id       : '589bb5ad5d4c3d03304f49c6',
    studentId : 'sid003',
    lastName  : 'Arnold',
    firstName : 'Gavin',
    school    : '589bb5ad5d4c3d03304f49c1',
    active    : true,
    withdrawn : false,
    cfa       : false,
    iep       : false,
    __v       : 0
  }, {
    _id       : '589bb5ad5d4c3d03304f49c7',
    studentId : 'sid004',
    lastName  : 'Hughes',
    firstName : 'Victor',
    school    : '589bb5ad5d4c3d03304f49c2',
    active    : true,
    withdrawn : false,
    cfa       : false,
    iep       : false,
    __v       : 0
  }, {
    _id       : '589bb5ad5d4c3d03304f49c8',
    studentId : 'sid005',
    lastName  : 'Thomson',
    firstName : 'Sue',
    school    : '589bb5ad5d4c3d03304f49c2',
    active    : true,
    withdrawn : false,
    cfa       : false,
    iep       : false,
    __v       : 0
  }
];

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

//This would be performed on the server in a real app. Just stubbing in.
const generateId = student => replaceAll(student.title, ' ', '-');

class StudentsApi {
  static getAllStudents() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Object.assign([], students));
      }, delay);
    });
  }

  static saveStudent(student) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate server-side validation
        const minStudentTitleLength = 1;
        if(student.title.length < minStudentTitleLength) {
          reject(`Title must be at least ${minStudentTitleLength} characters.`);
        }

        if(student.id) {
          const existingStudentIndex = students.findIndex(a => a.id == student.id);
          students.splice(existingStudentIndex, 1, student);
        } else {
          //Just simulating creation here.
          //The server would generate ids and watchHref's for new students in a real app.
          //Cloning so copy returned is passed by value rather than by reference.
          student.id = generateId(student);
          student.watchHref = `http://www.pluralsight.com/students/${student.id}`;
          students.push(student);
        }

        resolve(Object.assign({}, student));
      }, delay);
    });
  }

  static deleteStudent(studentId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const indexOfStudentToDelete = students.findIndex(student => {
          student.studentId == studentId;
        });
        students.splice(indexOfStudentToDelete, 1);
        resolve();
      }, delay);
    });
  }
}

export default StudentsApi;

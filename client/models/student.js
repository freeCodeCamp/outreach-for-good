import Immutable from 'immutable';

const StudentModel = Immutable.Record({
  _id       : '',
  studentId : '',
  lastName  : '',
  firstName : '',
  school    : '',
  active    : null,
  withdrawn : null,
  cfa       : null,
  iep       : null,
});

class Student extends StudentModel {
  constructor(student) {
    super(student);

    return student;
  }
}

export default Student;

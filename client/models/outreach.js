import Immutable from 'immutable';

const OutreachModel = Immutable.Record({
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

class Outreach extends OutreachModel {
  constructor(student) {
    super(student);

    return student;
  }
}

export default Outreach;

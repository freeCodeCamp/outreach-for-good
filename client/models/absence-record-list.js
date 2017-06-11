import Immutable from 'immutable';

const AbsenceRecordListModel = Immutable.Record({
  recordId           : '',
  schoolYear         : '',
  date               : '',
  entries            : [],
  newMissingStudents : [],
  createdStudents    : [],
});

class AbsenceRecordList extends AbsenceRecordListModel {
  // constructor(record) {
  //   super(record);
  //   record.date = new Date(record.date).toDateString();
  //   return record;
  // }
}

export default AbsenceRecordList;

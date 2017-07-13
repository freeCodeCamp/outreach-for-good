import Immutable from 'immutable';

const AbsenceRecordListModel = Immutable.Record({
  recordId           : '',
  schoolYear         : '',
  date               : '',
  entries            : '',
  newMissingStudents : '',
  createdStudents    : ''
});

class AbsenceRecordList extends AbsenceRecordListModel {
  constructor(record) {
    super(record);

    const date = new Date(record.get('date')).toDateString();
    const newMissingStudents = record.get('newMissingStudents').size;
    const entries = record.get('entries').size;
    const createdStudents = record.get('createdStudents').size;

    const newRecord = record.set('date', date)
      .set('entries', entries)
      .set('newMissingStudents', newMissingStudents)
      .set('createdStudents', createdStudents);

    return newRecord;
  }
}

export default AbsenceRecordList;

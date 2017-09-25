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

    let nextRecord = record.set('dateString', new Date(record.get('date')).toDateString());
    nextRecord = nextRecord.set('entryCount', record.get('entries').size);
    nextRecord = nextRecord.set('missingStudentsCount', record.get('newMissingStudents').size);
    nextRecord = nextRecord.set('createdStudentsCount', record.get('createdStudents').size);

    return nextRecord;
  }
}

export default AbsenceRecordList;

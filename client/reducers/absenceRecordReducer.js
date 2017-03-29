import * as types from '../actions/actionTypes';

import { List, fromJS } from 'immutable';
import AbsenceRecord from '../models/AbsenceRecordModel';
import AbsenceRecordListModel from '../models/AbsenceRecordListModel';

const initialState = new List();

export default (state = initialState, action) => {
  switch (action.type) {
  // Received users from fetchRecordsList()
  case types.LOAD_ABSENCE_RECORD_SUCCESS:
    return fromJS(action.absenceRecords)
      .map(record => new AbsenceRecord(record));
  case types.LOAD_SCHOOL_RECORD_LIST_SUCCESS:
    return fromJS(action.recordList)
      .map(recordList => new AbsenceRecordListModel(recordList));
  default:
    return state;
  }
};

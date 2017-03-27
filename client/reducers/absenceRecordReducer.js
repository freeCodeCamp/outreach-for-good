import * as types from '../actions/actionTypes';

import { List, fromJS } from 'immutable';
import AbsenceRecord from '../models/AbsenceRecordModel';

const initialState = new List();

export default (state = initialState, action) => {
  switch (action.type) {
  // Received users from fetchRecordsList()
  case types.LOAD_ABSENCE_RECORD_SUCCESS:
    return fromJS(action.absenceRecords)
      .map(record => new AbsenceRecord(record));

  default:
    return state;
  }
};

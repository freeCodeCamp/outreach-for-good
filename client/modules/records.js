import { List, fromJS } from 'immutable';

import AbsenceRecordsApi from '../api/absence-records';
import AbsenceRecordListModel from '../models/absence-record-list';
import { handleReducerError, errorMessage } from '../utils/error';

//ACTIONS
const FETCH_CURRENT_RECORD_SUCCESS = 'FETCH_CURRENT_RECORD_SUCCESS';
const ADD_RECORD_SUCCESS = 'ADD_RECORD_SUCCESS';
const REMOVE_RECORD_SUCCESS = 'REMOVE_RECORD_SUCCESS';
const LOAD_ABSENCE_RECORD_LIST_SUCCESS = 'LOAD_ABSENCE_RECORD_LIST_SUCCESS';

//REDUCER
const initialState = {};
export default function recordsReducer(state = initialState, action) {
  switch (action.type) {

  case FETCH_CURRENT_RECORD_SUCCESS: {
    return {
      ...state,
      latest : action.latestRecords
    };
  }

  case LOAD_ABSENCE_RECORD_LIST_SUCCESS: {
    let records = {};
    action.recordList.forEach(record => {
      records[record.recordId] = record;
    });
    return {
      ...state,
      [action.schoolId] : fromJS(records).map(recordList => new AbsenceRecordListModel(recordList))
    };
  }

  case ADD_RECORD_SUCCESS: {
    return {...state};
  }
  case REMOVE_RECORD_SUCCESS: {
    return {...state};
  }
  default: {
    return state;
  }
  }
}

//ACTION CREATORS
export function fetchRecords() {
  return dispatch => AbsenceRecordsApi.fetchRecords()
    .then(latestRecords => dispatch({
      type : FETCH_CURRENT_RECORD_SUCCESS,
      latestRecords
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.records.fetchRecords));
}

/**
 * Get list of absence records for the most recent
 *   - untested
 */
export function fetchSchoolRecordList(schoolId) {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchSchoolRecordList(schoolId).then(recordList =>
      dispatch({
        type : LOAD_ABSENCE_RECORD_LIST_SUCCESS,
        schoolId,
        recordList
      })
    )
    .catch(err => handleReducerError(err, dispatch, errorMessage.records.fetchSchoolRecordList));
  };
}

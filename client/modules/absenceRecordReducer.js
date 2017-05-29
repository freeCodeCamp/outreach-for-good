import { List, fromJS } from 'immutable';
import AbsenceRecord from '../models/AbsenceRecordModel';
import AbsenceRecordListModel from '../models/AbsenceRecordListModel';

import { validate } from './sessionReducer';
import { openSnackbar } from './viewReducer';
import AbsenceRecordsApi from './api/AbsenceRecordsApi';

//ACTIONS
const LOAD_ABSENCE_RECORD_SUCCESS = 'LOAD_ABSENCE_RECORD_SUCCESS';
const LOAD_SCHOOL_RECORD_LIST_SUCCESS = 'LOAD_ABSENCE_RECORD_LIST_SUCCESS';

//REDUCER
const initialState = new List();

export default (state = initialState, action) => {
  switch (action.type) {
  // Received users from fetchRecordsList()
  case LOAD_ABSENCE_RECORD_SUCCESS:
    return fromJS(action.absenceRecords)
        .map(record => new AbsenceRecord(record));

  case LOAD_SCHOOL_RECORD_LIST_SUCCESS:
    return fromJS(action.recordList)
        .map(recordList => new AbsenceRecordListModel(recordList));
  default:
    return state;
  }
};

//ACTION CREATORS
export function loadRecordsSuccess(absenceRecords) {
  return {type: LOAD_ABSENCE_RECORD_SUCCESS, absenceRecords};
}
/**
 * Get current absence records.
 *   - untested
 */
export function fetchRecords() {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchRecords().then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get the absence record of a particular student
 *   - untested
 */
export function fetchStudentRecord(studentId) {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchStudentRecord(studentId).then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get entries from current absence records.
 *   - untested
 */
export function fetchRecordsList() {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchRecordsList().then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get list of absence records for the most recent
 *   - untested
 */
export function fetchSchoolRecordList(schoolId) {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchSchoolRecordList(schoolId).then(recordList =>
      dispatch({
        type : LOAD_SCHOOL_RECORD_LIST_SUCCESS,
        recordList
      })
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get entries for students with outreaches specified by filter.
 *   - untested
 */
export function fetchRecordsListQuery(querystring) {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchRecordsListQuery(querystring).then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get entries for students at risk of becoming chronically absent.
 *   - untested
 */
export function fetchRecordsListAtRisk() {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchRecordsListAtRisk().then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get entries of chronically absent students.
 *   - untested
 */
export function fetchRecordsListChronic() {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchRecordsListChronic().then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get entries from specified absence record year.
 *   - untested
 */
export function fetchRecordsListYear(year) {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchRecordsListYear(year).then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Creates a new absence record in the DB.
 *   - untested
 */
export function addRecord(schoolId, record) {
  return function(dispatch) {
    return AbsenceRecordsApi.addRecord(schoolId, record).then(res => {
      // dispatch(loadRecordsSuccess(res))

      dispatch(openSnackbar(`Record added for ${res.record.school.name} with ${res.outreaches.length} outreaches created.`));
    })
    .catch(err => {
      dispatch(openSnackbar(`ERROR: ${err.toString()}`, 'error'));
    });
  };
}

/**
 * Delete an absence record
 *   - untested
 */
export function removeRecord(recordId) {
  return function(dispatch) {
    return AbsenceRecordsApi.removeRecord(recordId).then(res =>
      // dispatch(loadRecordsSuccess(res))

      dispatch(openSnackbar(`Record deleted for ${res.record.school.name}.`))
    )
    .catch(err => dispatch(openSnackbar(`ERROR: ${err.toString()}`, 'error')));
  };
}

/**
 * Handle expected return codes
 */
export function handleError(err, dispatch) {
  let status = err.status;
  //console.log('In userActions.js, handleError()', status, err);
  if(status == 401) {
    return dispatch(validate());
  } else {
    throw err;
  }
}

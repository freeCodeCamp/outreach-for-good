import * as types from './actionTypes';
import { validate } from './sessionActions';
import AbsenceRecordsApi from '../api/AbsenceRecordsApi';

export function loadRecordsSuccess(absenceRecords) {
  return {type: types.LOAD_ABSENCE_RECORD_SUCCESS, absenceRecords};
}

// Functions below handle asynchronous calls.
// Each returns a function that accepts a dispatch.
// These are used by redux-thunk to support asynchronous interactions.

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
  console.log('school record list');
  return function(dispatch) {
    return AbsenceRecordsApi.fetchSchoolRecordList(schoolId).then(recordList =>
      dispatch({
        type : types.LOAD_SCHOOL_RECORD_LIST_SUCCESS,
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
export function fetchRecordsListQuery() {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchRecordsListQuery().then(res =>
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
    return AbsenceRecordsApi.addRecord(schoolId, record).then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Delete an absence record
 *   - untested
 */
export function removeRecord(recordId) {
  return function(dispatch) {
    return AbsenceRecordsApi.removeRecord(recordId).then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Handle expected return codes
 */
export function handleError(err, dispatch) {
  let status = err.status;
  console.log('In userActions.js, handleError()', status, err);
  if(status == 401) {
    return dispatch(validate());
  } else {
    throw err;
  }
}

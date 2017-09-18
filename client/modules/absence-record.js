import { List, fromJS } from 'immutable';

import AbsenceRecord from '../models/absence-record';
import AbsenceRecordsApi from '../api/absence-records';
import { validate } from './session';
import { openSnackbar } from './view';

//ACTIONS
const LOAD_ABSENCE_RECORD_SUCCESS = 'LOAD_ABSENCE_RECORD_SUCCESS';

//REDUCER
const initialState = new List();

const formatDates = state =>
  state.map(record => {
    let timestamp = Date.parse(record.get('date'));
    let date = isNaN(timestamp) ? null : new Date(timestamp);
    return record.set('dateFormatted', date ?
      ('0' + date.getUTCFullYear()).slice(-2) + '-' +
      ('0' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
      ('0' + date.getUTCDate()).slice(-2) :
      null);
  });

export default (state = initialState, action) => {
  switch (action.type) {
  // Received users from fetchRecordsList()
  case LOAD_ABSENCE_RECORD_SUCCESS:
    return formatDates(
      fromJS(action.absenceRecords)
        .map(record => new AbsenceRecord(record)
      ));

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
export function fetchRecordsList(yearFilter) {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchRecordsList(yearFilter).then(res =>
      dispatch(loadRecordsSuccess(res))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get entries for students with outreaches specified by filter.
 *   - untested
 */
export function fetchRecordsListQuery(querystring, yearFilter) {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchRecordsListQuery(querystring, yearFilter).then(res =>
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

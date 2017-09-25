import { fromJS } from 'immutable';

import AbsenceRecord from '../models/absence-record';
import AbsenceRecordsApi from '../api/absence-records';
import { formatDate } from '../utils/date';
import { handleReducerError, errorMessage } from '../utils/error';
import { openSnackbar } from './view';

//ACTIONS
const LOAD_ABSENCE_RECORD_SUCCESS = 'LOAD_ABSENCE_RECORD_SUCCESS';

//REDUCER

const parseDate = state =>
  state.map(record => {
    let timestamp = Date.parse(record.get('date'));
    let date = isNaN(timestamp) ? null : new Date(timestamp);
    return record.set('dateFormatted', date ? formatDate(date) : null);
  });

export default function reducer(state = {}, action) {
  switch (action.type) {
  case LOAD_ABSENCE_RECORD_SUCCESS:
    return parseDate(
      fromJS(action.absenceRecords)
        .map(record => new AbsenceRecord(record)
      ));

  default:
    return state;
  }
}

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
    .catch(err => handleReducerError(err, dispatch, errorMessage.absenceRecord.fetchRecords));
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
    .catch(err => handleReducerError(err, dispatch, errorMessage.absenceRecord.fetchStudentRecord));
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
    .catch(err => handleReducerError(err, dispatch, errorMessage.absenceRecord.fetchRecordsList));
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
    .catch(err => handleReducerError(err, dispatch, errorMessage.absenceRecord.fetchRecordsListQuery));
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
    .catch(err => handleReducerError(err, dispatch, errorMessage.absenceRecord.fetchRecordsListAtRisk));
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
    .catch(err => handleReducerError(err, dispatch, errorMessage.absenceRecord.fetchRecordsListChronic));
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
    .catch(err => handleReducerError(err, dispatch, errorMessage.absenceRecord.fetchRecordsListYear));
  };
}

/**
 * Creates a new absence record in the DB.
 *   - untested
 */
export function addRecord(schoolId, record) {
  return function(dispatch) {
    return AbsenceRecordsApi.addRecord(schoolId, record).then(res => {
      console.log('record', record);
      dispatch(openSnackbar(`Record added for ${res.record.school.name} with ${res.outreaches.length} outreaches created.`));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.absenceRecord.addRecord));
  };
}

/**
 * Delete an absence record
 *   - untested
 */
export function removeRecord(recordId) {
  return function(dispatch) {
    return AbsenceRecordsApi.removeRecord(recordId).then(res => {
      console.log('record', recordId, res);
      dispatch(openSnackbar(`Record deleted for ${res.record.school.name}.`));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.absenceRecord.removeRecord));
  };
}


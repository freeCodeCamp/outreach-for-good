import * as types from './actionTypes';
import AbsenceRecordsApi from '../api/AbsenceRecordsApi';

export function confirmRecord(record) {
  return {
    type    : types.CONFIRM_RECORD,
    payload : record
  };
}

export function fetchSchools() {
  return dispatch => AbsenceRecordsApi.fetchSchools()
    .then(schools => dispatch({
      type : types.FETCH_SCHOOLS_SUCCESS,
      schools
    }));
}

export function fetchCurrentRecord() {
  return dispatch => AbsenceRecordsApi.fetchCurrentRecord()
    .then(current => dispatch({
      type : types.FETCH_CURRENT_RECORD_SUCCESS,
      current
    }));
}

export function fetchRecordList(schoolId) {
  return dispatch => AbsenceRecordsApi.fetchRecordList(schoolId)
    .then(records => dispatch({
      type : types.FETCH_RECORD_LIST_SUCCESS,
      records
    }));
}

export function postRecord(record) {
  return dispatch => AbsenceRecordsApi.postRecord(record)
    .then(() => dispatch({
      type : types.POST_RECORD_SUCCESS
    }));
}

export function getSchoolRecord(schoolId) {
  return {
    type    : types.FETCH_CURRENT_RECORD,
    payload : schoolId
  };
}

import * as types from './actionTypes';
import AbsenceRecordsApi from '../api/AbsenceRecordsApi';

export function confirmRecord(record) {
  return {
    type    : types.CONFIRM_RECORD,
    payload : record
  };
}
// COMMENTED OUT TO MAKE USE OF THE GET SCHOOL NAMES CALL IN SCHOOLS API
// export function fetchSchools() {
//   return dispatch => AbsenceRecordsApi.fetchSchools()
//     .then(schools => dispatch({
//       type : types.FETCH_SCHOOLS_SUCCESS,
//       schools
//     }));
// }

export function getCurrentRecord() {
  return dispatch => AbsenceRecordsApi.getCurrentRecord()
    .then(current => dispatch({
      type : types.FETCH_CURRENT_RECORD_SUCCESS,
      current
    }));
}

export function getSchoolRecordList(schoolId) {
  return dispatch => AbsenceRecordsApi.getSchoolRecordList(schoolId)
    .then(recordsList => dispatch({
      type : types.FETCH_SCHOOL_RECORD_LIST,
      recordsList
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

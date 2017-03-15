import * as types from './actionTypes';

export function confirmRecord(record) {
  return {
    type    : types.CONFIRM_RECORD,
    payload : record
  };
}

export function getSchools() {
  return {
    type : types.GET_SCHOOLS
  };
}

export function getSchoolRecord(schoolId) {
  return {
    type    : types.GET_SCHOOL_RECORD,
    payload : schoolId
  };
}

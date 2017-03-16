import * as types from './actionTypes';

export function fetchStudent(studentId) {
  return {
    type    : types.FETCH_STUDENT,
    payload : studentId
  };
}

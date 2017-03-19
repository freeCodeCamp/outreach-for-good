import * as types from './actionTypes';
import StudentApi from '../api/StudentApi';

export function fetchStudent(studentId) {
  return dispatch => StudentApi.fetchStudent(studentId)
    .then(student => dispatch({
      type : types.FETCH_STUDENT_SUCCESS,
      student
    }));
}

export function unmountStudent() {
  return {
    type : types.UNMOUNT_STUDENT
  };
}

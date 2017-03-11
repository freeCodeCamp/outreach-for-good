import * as types from './actionTypes';

export function confirmStudents(students) {
  return {
    type : types.CONFIRM_STUDENTS,
    students
  };
}

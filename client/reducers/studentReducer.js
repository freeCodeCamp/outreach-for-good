import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function studentReducer(state = initialState.student, action) {
  switch (action.type) {
  case types.FETCH_STUDENT_SUCCESS: {
    let record = action.student;
    return {
      ...state,
      record
    };
  }
  case types.UNMOUNT_STUDENT: {
    let record = {};
    return {
      ...state,
      record
    };
  }
  default: {
    return state;
  }
  }
}

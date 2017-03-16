import * as types from '../actions/actionTypes';

const students = {
  1000 : {
    studentId : '0001',
    lastName  : 'Braskey',
    firstName : 'Bill',
    grade     : 8,
    school    : 100001,
    iep       : true,
    cfa       : true,
    withdrawn : false,
    active    : true
  }
};

export default function studentReducer(state = {}, action) {
  switch (action.type) {
  case types.FETCH_STUDENT: {
    let student = students[action.payload];
    return {
      ...state,
      student
    };
  }
  default: {
    return state;
  }
  }
}

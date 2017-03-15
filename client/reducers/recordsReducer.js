import * as types from '../actions/actionTypes';
import iState from './initialState';

export default function recordsReducer(state = iState.records, action) {
  switch (action.type) {
  case types.CONFIRM_RECORD: {
    return {
      ...state,
      absenceRecords : [...state.absenceRecords, action.payload]
    };
  }
  case types.GET_SCHOOLS: {
    const schools = [
      {_id: 1001, name: 'School A', triggers: [], active: true},
      {_id: 1002, name: 'School B', triggers: [], active: true},
      {_id: 1003, name: 'School C', triggers: [], active: true},
      {_id: 1004, name: 'School D', triggers: [], active: true}
    ];

    return {
      ...state,
      schools
    };
  }
  // case types.GET_SCHOOL_RECORD: {
  //   let schoolRecord = state.absenceRecords.filter(record => record.schoolId === action.payload)
  //   return {
  //     ...state,
  //   };
  // }
  default: {
    return state;
  }
  }
}

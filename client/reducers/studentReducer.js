import * as types from '../actions/actionTypes';

const initialState = {
  student       : {},
  records       : [],
  interventions : [],
  outreaches    : [],
  notes         : []
};

export default function studentReducer(state = initialState, action) {
  switch (action.type) {
  case types.GET_STUDENT_SUCCESS: {
    return {
      ...state,
      student : action.student
    };
  }
  case types.GET_STUDENT_RECORDS_SUCCESS: {
    return {
      ...state,
      records : action.records
    };
  }
  case types.GET_STUDENT_INTERVENTIONS_SUCCESS: {
    return {
      ...state,
      interventions : action.interventions
    };
  }
  case types.GET_STUDENT_OUTREACHES_SUCCESS: {
    return {
      ...state,
      outreaches : action.outreaches
    };
  }
  case types.GET_STUDENT_NOTES_SUCCESS: {
    return {
      ...state,
      notes : action.notes
    };
  }
  // case 'POST_NOTE_SUCCESS': {
  //   return {
  //     ...state,
  //     notes : [...state.notes, action.notes]
  //   };
  // }
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

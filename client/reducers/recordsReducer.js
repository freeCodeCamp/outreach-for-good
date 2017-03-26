import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function recordsReducer(state = initialState.records, action) {
  switch (action.type) {
  case types.CONFIRM_RECORD: {
    return {
      ...state,
      absenceRecords : [...state.absenceRecords, action.payload]
    };
  }
  case types.FETCH_SCHOOLS_SUCCESS: {
    let schools = action.schools;
    return {
      ...state,
      schools
    };
  }
  case types.FETCH_SCHOOL_RECORD_LIST: {
    return {
      ...state,
      list : action.recordsList
    };
  }
  case types.FETCH_CURRENT_RECORD_SUCCESS: {
    let current = action.current;
    return {
      ...state,
      current
    };
  }
  case types.FETCH_RECORD_LIST_SUCCESS: {
    let list = action.records;
    return {
      ...state,
      list
    };
  }
  case types.POST_RECORD_SUCCESS: {
    return {...state};
  }
  default: {
    return state;
  }
  }
}

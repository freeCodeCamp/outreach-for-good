import * as types from '../actions/actionTypes';
// import {List, fromJS} from 'immutable';
// import initialState from './initialState';
// const initialState = new List();

const initialState = {
  view : {
    currentTab : 'upload'
  },
  current : []
};
export default function recordsReducer(state = initialState, action) {
  switch (action.type) {
  case 'CHANGE_TAB': {
    console.log(action.currentTab);
    return {
      ...state,
      view : {
        currentTab : action.currentTab
      }
    };
  }
  case types.FETCH_CURRENT_RECORD_SUCCESS: {
    let current = action.current;
    return {
      ...state,
      current
    };
  }
  case 'ADD_RECORD_SUCCESS': {
    return {...state};
  }
  case 'REMOVE_RECORD_SUCCESS': {
    return {...state};
  }
  default: {
    return state;
  }
  }
}

import * as types from '../actions/actionTypes';
import iState from './initialState';

export default function viewReducer(state = iState.view, action) {
  switch (action.type) {
  case types.TOGGLE_EXPAND_SIDEBAR:
    return {
      sidebar : {
        expand : action.open,
      }
    };
  default:
    return state;
  }
}

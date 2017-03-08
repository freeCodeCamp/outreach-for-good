import * as types from '../actions/actionTypes';
import iState from './initialState';

export default function sessionReducer(state = iState.session, action) {
  switch (action.type) {
  case types.SESSION_VALID:
    return {
      token : action.token,
    };
  case types.SESSION_CLEAR:
    return {
      token : null,
    };
  default:
    return state;
  }
}

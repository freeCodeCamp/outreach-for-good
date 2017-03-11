import * as types from '../actions/actionTypes';
import iState from './initialState';

export default function sessionReducer(state = iState.session, action) {
  console.log(action);
  switch (action.type) {
  case types.SESSION_VALID:
    return {
      token : action.token,
      me    : {
        id    : action.me._id,
        name  : action.me.name,
        email : action.me.email,
        image : action.me.google.image.url || '',
        role  : action.me.role
      }
    };
  case types.SESSION_CLEAR:
    return {
      token : null,
      me    : {
        id    : null,
        name  : null,
        email : null,
        image : null,
        role  : null
      }
    };
  default:
    return state;
  }
}

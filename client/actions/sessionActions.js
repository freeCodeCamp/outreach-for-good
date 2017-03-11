import * as types from './actionTypes';
import userAPI from '../api/mockUsersApi';
import cookies from 'browser-cookies';

export function loadMeSuccess(token, me) {
  return {type: types.SESSION_VALID, token, me};
}

export function validate() {
  let token = cookies.get('token');
  if(token) {
    // Thunk returns a function that accepts a dispatch
    return function(dispatch) {
      return userAPI.getMe().then(me => {
        dispatch(loadMeSuccess(token, me));
      })
      .catch(err => {
        throw err;
      });
    };
  }
  return {type: types.SESSION_CLEAR};
}

export function logout() {
  cookies.erase('token');
  return {type: types.SESSION_CLEAR};
}

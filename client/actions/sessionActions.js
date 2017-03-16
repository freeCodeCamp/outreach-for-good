import * as types from './actionTypes';
import userAPI from '../api/UsersApi';
import cookies from 'browser-cookies';

export function setToken(token, me) {
  return {type: types.SET_TOKEN, token, me};
}

export function sessionValid() {
  return {type: types.SESSION_VALID};
}

export function logout() {
  cookies.erase('token');
  return {type: types.SESSION_CLEAR};
}

/**
 *  Attempt to add JWT to session
 */
export function verifyToken() {
  // Tokens come with surrounding parentheses
  let token = cookies.get('token').replace(/"/g, '');
  if(token) {
    sessionStorage.setItem('token', token);
    // Thunk returns a function that accepts a dispatch
    return function(dispatch) {
      return userAPI.getMyself(token).then(me => {
        dispatch(setToken(token, me));
      })
      .catch(err => {
        throw err;
      });
    };
  }
  // No JWT to add, ensure user is logged out
  return {type: types.SESSION_CLEAR};
}

/**
 *  Verify session contains JWT for api calls
 */
export function validate() {
  return (dispatch, getState) => getState().session.token // eslint-disable-line no-confusing-arrow
    ? dispatch(sessionValid()) : dispatch(verifyToken());
}

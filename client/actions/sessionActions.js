import * as types from './actionTypes';
import userAPI from '../api/UsersApi';
import cookies from 'browser-cookies';
import { browserHistory } from 'react-router';

export function setToken(token, me) {
  console.log('Setting Token');
  return {type: types.SET_TOKEN, token, me};
}

export function sessionValid() {
  return {type: types.SESSION_VALID};
}

export function logout() {
  cookies.erase('token');
  browserHistory.push('/login');
  return {type: types.SESSION_CLEAR};
}

/**
 *  Attempt to initialize session with JWT
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
      .catch(() => dispatch(logout()));
    };
  }
  // No JWT to add, ensure user is logged out
  return dispatch => dispatch(logout());
}

/**
 *  Verify session contains JWT for api calls
 */
export function validate() {
  return (dispatch, getState) =>
    getState().session.token
    ? userAPI.getMyself().then(() =>
      dispatch(sessionValid()))
      .catch(() => dispatch(verifyToken()))
    : dispatch(verifyToken());
}

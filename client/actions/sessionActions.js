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

export function verifyToken() {
  let token = cookies.get('token').replace(/"/g, '');
  //console.log('Validate Session: ', token)
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
  return {type: types.SESSION_CLEAR};
}

export function validate() {
  return (dispatch, getState) => getState().session.token // eslint-disable-line no-confusing-arrow
    ? dispatch(sessionValid()) : dispatch(verifyToken());
}

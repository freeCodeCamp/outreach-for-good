import { browserHistory } from 'react-router';

import cookies from 'browser-cookies';

import userAPI from '../api/users';
import { handleReducerError, errorMessage } from '../utils/error';

//ACTIONS
const SET_TOKEN = 'SET_TOKEN';
const SESSION_VALID = 'SESSION_VALID';
const SESSION_CLEAR = 'SESSION_CLEAR';

//REDUCER
const initialState = {};

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
  case SET_TOKEN:
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
  case SESSION_VALID:
    return state;
  case SESSION_CLEAR:
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

//ACTION CREATORS
export function setToken(token, me) {
  return {type: SET_TOKEN, token, me};
}

export function sessionValid() {
  return {type: SESSION_VALID};
}

export function logout() {
  cookies.erase('token');
  browserHistory.push('/login');
  return {type: SESSION_CLEAR};
}

/**
 *  Attempt to initialize session with JWT
 */
export function verifyToken() {
  // Tokens come with surrounding parentheses
  let token = cookies.get('token').replace(/"/g, '');
  if(token) {
    sessionStorage.setItem('token', token);
    return function(dispatch) {
      return userAPI.getMyself(token).then(me => {
        if(me && me.role === 'guest') {
          dispatch(logout());
        } else {
          dispatch(setToken(token, me));
        }
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

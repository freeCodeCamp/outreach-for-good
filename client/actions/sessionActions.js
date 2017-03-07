import * as types from './actionTypes';
import cookies from 'browser-cookies';

export function validate() {
  return {type: types.SESSION_VALID, token: cookies.get('token')};
}

export function logout() {
  cookies.erase('token');
  return {type: types.SESSION_CLEAR};
}


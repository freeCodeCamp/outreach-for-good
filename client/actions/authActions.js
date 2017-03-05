import * as types from './actionTypes';
import authApi from '../api/AuthApi';

export function loginSuccess() {
  console.log('Login Success');
  return {type: types.LOGIN_SUCCESS};
}

export function login() {
  console.log('arrived');
  return function(dispatch) {
    return authApi.login().then(res => {
      console.log('in login action', res);
      sessionStorage.setItem('jwt', res.jwt);
      dispatch(loginSuccess());
    })
    .catch(err => {
      throw err;
    });
  };
}

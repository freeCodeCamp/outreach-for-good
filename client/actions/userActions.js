import * as types from './actionTypes';
import userAPI from '../api/mockUsersApi';

export function loadUsersSuccess(users) {
  return {type: types.LOAD_USERS_SUCCESS, users};
}

export function loadUsers() {
  return function(dispatch) {
    return userAPI.getAllUsers().then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => {
      throw err;
    });
  };
}

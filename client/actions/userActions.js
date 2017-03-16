import * as types from './actionTypes';
import userAPI from '../api/UsersApi';

export function loadUsersSuccess(users) {
  return {type: types.LOAD_USERS_SUCCESS, users};
}

// Functions below handle asynchronous calls.
// Each returns a function that accepts a dispatch.
// These are used by redux-thunk to support asynchronous interactions.

export function getMyself() {
  return function(dispatch) {
    return userAPI.getMyself().then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => {
      throw err;
    });
  };
}

export function getUser(userId) {
  return function(dispatch) {
    return userAPI.getUser(userId).then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => {
      throw err;
    });
  };
}

export function getAllUsers() {
  return function(dispatch) {
    return userAPI.getUsers().then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => {
      console.log('error :: ', err)
      throw err;
    });
  };
}

export function updateUserRole(userId, roleId) {
  return function(dispatch) {
    return userAPI.updateRole(userId, roleId).then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => {
      throw err;
    });
  };
}

export function updateUserSchool(userId, schoolId) {
  return function(dispatch) {
    return userAPI.updateSchool(userId, schoolId).then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => {
      throw err;
    });
  };
}

export function RemoveUser(userId) {
  return function(dispatch) {
    return userAPI.removeUser(userId).then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => {
      throw err;
    });
  };
}

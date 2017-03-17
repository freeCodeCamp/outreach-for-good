import * as types from './actionTypes';
import { validate } from './sessionActions';
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
    .catch(err => handleError(err, dispatch));
  };
}

export function getUser(userId) {
  return function(dispatch) {
    return userAPI.getUser(userId).then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => handleError(err, dispatch));
  };
}

export function getAllUsers() {
  return function(dispatch) {
    return userAPI.getUsers().then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => handleError(err, dispatch));
  };
}

export function updateUserRole(userId, roleId) {
  return function(dispatch) {
    return userAPI.updateRole(userId, roleId).then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => handleError(err, dispatch));
  };
}

export function updateUserSchool(userId, schoolId) {
  return function(dispatch) {
    return userAPI.updateSchool(userId, schoolId).then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => handleError(err, dispatch));
  };
}

export function removeUser(userId) {
  return function(dispatch) {
    return userAPI.removeUser(userId).then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Handle expected return codes
 */
export function handleError(err, dispatch) {
  let status = err.status;
  if(status == 401) {
    return dispatch(validate());
  } else {
    throw err;
  }
}

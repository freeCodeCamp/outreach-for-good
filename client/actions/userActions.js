import * as types from './actionTypes';
import { validate } from './sessionActions';
import userAPI from '../api/UsersApi';

export function loadUsersSuccess(users) {
  return {type: types.LOAD_USERS_SUCCESS, users};
}

// Functions below handle asynchronous calls.
// Each returns a function that accepts a dispatch.
// These are used by redux-thunk to support asynchronous interactions.

/**
 * Get my record, allowed for all registered users
 */
export function getMyself() {
  return function(dispatch) {
    return userAPI.getMyself().then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => handleError(err, dispatch));
  };
}

// Not Tested
export function getUser(userId) {
  return function(dispatch) {
    return userAPI.getUser(userId).then(users => {
      dispatch(loadUsersSuccess(users));
    })
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get a list of all users
 */
export function getAllUsers() {
  return function(dispatch) {
    return userAPI.getUsers().then(res => {
      console.log('getAllUsers API: ', res);
      return dispatch(loadUsersSuccess(res));
    })
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Modify users role
 * @input:  ary   _id
 * @input:  str   guest|teacher|manager|admin|super
 */
export function updateUserRole(userId, roleId) {
  return function(dispatch) {
    let promises = userId.map(user => userAPI.updateRole(user, roleId));
    return Promise.all(promises)
    .then(() => dispatch(getAllUsers()))
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Modify users assigned school
 * @input:  ary   _id
 * @input:  str   _id  (assigned school)
 */
export function updateUserSchool(userId, schoolId) {
  return function(dispatch) {
    let promises = userId.map(user => userAPI.updateSchool(user, schoolId));
    return Promise.all(promises)
    .then(() => dispatch(getAllUsers()))
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Remove users from the database
 * @input:  ary   _id
 */
export function removeUser(userId) {
  return function(dispatch) {
    let promises = userId.map(user => userAPI.removeUser(user));
    return Promise.all(promises)
    .then(() => dispatch(getAllUsers()))
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Handle expected return codes
 */
export function handleError(err, dispatch) {
  let status = err.status;
  console.log('In userActions.js, handleError()', status, err);
  if(status == 401) {
    return dispatch(validate());
  } else {
    throw err;
  }
}

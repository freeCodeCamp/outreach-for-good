import { List, fromJS } from 'immutable';

import User from '../models/user';
import { validate } from './session';
import UsersApi from '../api/users';


//ACTIONS
const LOAD_USERS_SUCCESS = 'LOAD_USERS_SUCCESS';

//REDUCER
const initialState = new List();

// const mergeEntities = (state, newUsers) =>
//   state.merge(newUsers.map(user => new User(user)));

export default (state = initialState, action) => {
  switch (action.type) {
  // Received users from getAllUsers()
  case LOAD_USERS_SUCCESS:
    return fromJS(action.users).map(user => new User(user));

  default:
    return state;
  }
};

//ACTION CREATORS
export function loadUsersSuccess(users) {
  return {type: LOAD_USERS_SUCCESS, users};
}

/**
 * Get my record, allowed for all registered users
 */
export function getMyself() {
  return function(dispatch) {
    return UsersApi.getMyself().then(users =>
      dispatch(loadUsersSuccess(users))
    )
    .catch(err => handleError(err, dispatch));
  };
}

// Not Tested
export function getUser(userId) {
  return function(dispatch) {
    return UsersApi.getUser(userId).then(users =>
      dispatch(loadUsersSuccess(users))
    )
    .catch(err => handleError(err, dispatch));
  };
}

/**
 * Get a list of all users
 */
export function getAllUsers() {
  return function(dispatch) {
    return UsersApi.getUsers().then(res =>
      //console.log('getAllUsers API: ', res);
       dispatch(loadUsersSuccess(res)))
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
    let promises = userId.map(user => UsersApi.updateRole(user, roleId));
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
    let promises = userId.map(user => UsersApi.updateSchool(user, schoolId));
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
    let promises = userId.map(user => UsersApi.removeUser(user));
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

import * as types from './actionTypes';
import { validate } from './sessionActions';
import schoolAPI from '../api/SchoolsApi';

export function loadSchoolsSuccess(schools) {
  return {type: types.LOAD_SCHOOLS_SUCCESS, schools};
}

// Functions below handle asynchronous calls.
// Each returns a function that accepts a dispatch.
// These are used by redux-thunk to support asynchronous interactions.

export function getSchoolNames() {
  return function(dispatch) {
    return schoolAPI.getSchoolNames().then(schools => {
      dispatch(loadSchoolsSuccess(schools));
    })
    .catch(err => handleError(err, dispatch));
  };
}

export function getSchool(schoolId) {
  return function(dispatch) {
    return schoolAPI.getSchool(schoolId).then(schools => {
      dispatch(loadSchoolsSuccess(schools));
    })
    .catch(err => handleError(err, dispatch));
  };
}

export function getAllSchools() {
  return function(dispatch) {
    return schoolAPI.getSchools().then(res => {
      //console.log('getAllSchools API: ', res);
      return dispatch(loadSchoolsSuccess(res));
    })
    .catch(err => handleError(err, dispatch));
  };
}

export function addSchool(schoolName) {
  return function(dispatch) {
    return schoolAPI.addSchool(schoolName)
    .then(() => dispatch(getAllSchools()))
    .catch(err => handleError(err, dispatch));
  };
}

export function removeSchool(schoolId) {
  return function(dispatch) {
    let promises = schoolId.map(school => schoolAPI.removeSchool(school));
    return Promise.all(promises)
    .then(() => dispatch(getAllSchools()))
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

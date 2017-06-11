import { List, fromJS } from 'immutable';
import School from '../models/school';
import SchoolsApi from '../api/schools';
import {validate} from './session';

//ACTIONS
const LOAD_SCHOOLS_SUCCESS = 'LOAD_SCHOOLS_SUCCESS';

//REDUCER
// const mergeEntities = (state, newSchools) =>
//   state.merge(newSchools.map(school => new School(school)));
const initialState = new List();
export default (state = initialState, action) => {
  switch (action.type) {
  // Received schools from getAllSchools()
  case LOAD_SCHOOLS_SUCCESS:
    //console.log('school names: ', action.schools);
    return fromJS(action.schools).map(school => new School(school));

  default:
    return state;
  }
};

//ACTION CREATORS
export function loadSchoolsSuccess(schools) {
  return {type: LOAD_SCHOOLS_SUCCESS, schools};
}

// Functions below handle asynchronous calls.
// Each returns a function that accepts a dispatch.
// These are used by redux-thunk to support asynchronous interactions.

export function getSchoolNames() {
  return function(dispatch) {
    return SchoolsApi.getSchoolNames().then(schools => {
      dispatch(loadSchoolsSuccess(schools));
    })
    .catch(err => handleError(err, dispatch));
  };
}

export function getSchool(schoolId) {
  return function(dispatch) {
    return SchoolsApi.getSchool(schoolId).then(schools => {
      dispatch(loadSchoolsSuccess(schools));
    })
    .catch(err => handleError(err, dispatch));
  };
}

export function getAllSchools() {
  return function(dispatch) {
    return SchoolsApi.getSchools()
      .then(schools => dispatch(loadSchoolsSuccess(schools)))
      .catch(err => handleError(err, dispatch));
  };
}

export function addSchool(schoolName) {
  return function(dispatch) {
    return SchoolsApi.addSchool(schoolName)
    .then(() => dispatch(getAllSchools()))
    .catch(err => handleError(err, dispatch));
  };
}

export function removeSchool(schoolId) {
  return function(dispatch) {
    let promises = schoolId.map(school => SchoolsApi.removeSchool(school));
    return Promise.all(promises)
    .then(() => dispatch(getAllSchools()))
    .catch(err => handleError(err, dispatch));
  };
}

export function changeTriggers(schoolId, triggers) {
  return dispatch => {
    SchoolsApi.changeTriggers(schoolId, triggers)
      .then(school => {
        dispatch(getAllSchools());
        dispatch({
          type      : 'OPEN_SNACKBAR',
          message   : `Triggers updated for ${school.name}`,
          snackType : 'success'
        });
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
    dispatch({
      type      : 'OPEN_SNACKBAR',
      message   : `Error: ${err.toString()}`,
      snackType : 'error'
    });
    throw err;
  }
}

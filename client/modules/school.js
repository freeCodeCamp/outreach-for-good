import { List, fromJS } from 'immutable';
import School from '../models/school';
import SchoolsApi from '../api/schools';
import { handleReducerError, errorMessage } from '../utils/error';

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
    .catch(err => handleReducerError(err, dispatch, errorMessage.school.getSchoolNames));
  };
}

export function getSchool(schoolId) {
  return function(dispatch) {
    return SchoolsApi.getSchool(schoolId).then(schools => {
      dispatch(loadSchoolsSuccess(schools));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.school.getSchool));
  };
}

export function getAllSchools() {
  return function(dispatch) {
    return SchoolsApi.getSchools()
      .then(schools => dispatch(loadSchoolsSuccess(schools)))
    .catch(err => handleReducerError(err, dispatch, errorMessage.school.getAllSchools));
  };
}

export function addSchool(schoolName) {
  return function(dispatch) {
    return SchoolsApi.addSchool(schoolName)
    .then(() => dispatch(getAllSchools()))
    .catch(err => handleReducerError(err, dispatch, errorMessage.school.addSchool));
  };
}

export function removeSchool(schoolId) {
  return function(dispatch) {
    let promises = schoolId.map(school => SchoolsApi.removeSchool(school));
    return Promise.all(promises)
    .then(() => dispatch(getAllSchools()))
    .catch(err => handleReducerError(err, dispatch, errorMessage.school.removeSchool));
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
    .catch(err => handleReducerError(err, dispatch, errorMessage.school.changeTriggers));
  };
}

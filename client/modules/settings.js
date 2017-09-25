import SettingsApi from '../api/settings';
import {getOutreachCounts} from './reports';
import {openSnackbar} from './view';
import { handleReducerError, errorMessage } from '../utils/error';

const SET_WITHDRAWN_STUDENTS = 'TOGGLE_WITHDRAWN_STUDENTS';
const GET_INTERVENTION_TYPES_SUCCESS = 'GET_INTERVENTION_TYPES_SUCCESS';

const initialState = {
  withdrawnStudents : false,
  interventionTypes : []
};

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
  case SET_WITHDRAWN_STUDENTS: {
    return {
      ...state,
      withdrawnStudents : !state.withdrawnStudents
    };
  }
  case GET_INTERVENTION_TYPES_SUCCESS: {
    return {
      ...state,
      interventionTypes : action.interventionTypes
    };
  }
  default: return state;
  }
}

export function setWithdrawnStudents(showWidthDrawnStudents) {
  return dispatch => {
    dispatch({
      type : SET_WITHDRAWN_STUDENTS,
      showWidthDrawnStudents
    });
    return dispatch(getOutreachCounts(`withdrawn=${showWidthDrawnStudents}`));
  };
}

export function getInterventionTypes() {
  return dispatch => SettingsApi.getInterventionTypes()
    .then(interventionTypes => {
      dispatch({
        type : GET_INTERVENTION_TYPES_SUCCESS,
        interventionTypes
      });
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.settings.getInterventionTypes));
}

export function putInterventionType(typeId, intervention) {
  return dispatch => SettingsApi.putInterventionType(typeId, intervention)
    .then(res => {
      dispatch(getInterventionTypes());
      dispatch(openSnackbar(`Intervention ${res.title} updated!`));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.settings.putInterventionType));
}

export function postInterventionType(intervention) {
  return dispatch => SettingsApi.postInterventionType(intervention)
    .then(res => {
      dispatch(getInterventionTypes());
      dispatch(openSnackbar(`Intervention ${res.title} created!`));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.settings.postInterventionType));
}

export function deleteInterventionType(typeId) {
  return dispatch => SettingsApi.deleteInterventionType(typeId)
    .then(res => {
      dispatch(getInterventionTypes());
      dispatch(openSnackbar(`Intervention ${res.title} deleted!`));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.settings.deleteInterventionType));
}

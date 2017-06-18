import SettingsApi from '../api/settings';
import {openSnackbar} from './view';

const GET_INTERVENTION_TYPES_SUCCESS = 'GET_INTERVENTION_TYPES_SUCCESS';

const initialState = {
  interventionTypes : []
};

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
  case GET_INTERVENTION_TYPES_SUCCESS: {
    return {
      ...state,
      interventionTypes : action.interventionTypes
    };
  }
  default: return state;
  }
}

export function getInterventionTypes() {
  return dispatch => SettingsApi.getInterventionTypes()
    .then(interventionTypes => {
      dispatch({
        type : GET_INTERVENTION_TYPES_SUCCESS,
        interventionTypes
      });
    })
    .catch(err => dispatch(openSnackbar(`ERR: ${err}`, 'error')));
}

export function putInterventionType(typeId, intervention) {
  return dispatch => SettingsApi.putInterventionType(typeId, intervention)
    .then(res => {
      dispatch(getInterventionTypes());
      dispatch(openSnackbar(`Intervention ${res.title} updated!`));
    })
    .catch(err => dispatch(`ERR: ${err}`, 'error'));
}

export function postInterventionType(intervention) {
  return dispatch => SettingsApi.postInterventionType(intervention)
    .then(res => {
      dispatch(getInterventionTypes());
      dispatch(openSnackbar(`Intervention ${res.title} created!`));
    })
    .catch(err => dispatch(`ERR: ${err}`, 'error'));
}

export function deleteInterventionType(typeId) {
  return dispatch => SettingsApi.deleteInterventionType(typeId)
    .then(res => {
      dispatch(getInterventionTypes());
      dispatch(openSnackbar(`Intervention ${res.title} deleted!`));
    })
    .catch(err => dispatch(`ERR: ${err}`, 'error'));
}

import SettingsApi from './api/SettingsApi';
import {openSnackbar} from './viewReducer';

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

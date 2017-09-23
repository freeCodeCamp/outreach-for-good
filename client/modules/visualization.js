import VisualizationApi from '../api/visualization';
import { handleReducerError, errorMessage } from '../utils/error';

//ACTIONS
const DATA_VISUALIZATION_SUCCESS = 'DATA_VISUALIZATION_SUCCESS';

//REDUCER
const initialState = {
  cfa : [],
  non : []
};

export default function viewReducer(state = initialState, action) {
  switch (action.type) {
  case DATA_VISUALIZATION_SUCCESS:
    let visualization = {};
    for(let key in action.visualization) {
      visualization[key] = [];
      for(let name in action.visualization[key]) {
        visualization[key].push({name, value: action.visualization[key][name]});
      }
    }
    return visualization;
  default:
    return state;
  }
}

//ACTION CREATORS
export function getCombined() {
  return dispatch => VisualizationApi.getCombined()
    .then(combined => dispatch({
      type          : DATA_VISUALIZATION_SUCCESS,
      visualization : combined
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.visualization.getSchoolComparison));
}

export function getSchoolComparison(schoolId) {
  return dispatch => VisualizationApi.getSchoolComparison(schoolId)
    .then(school => dispatch({
      type          : DATA_VISUALIZATION_SUCCESS,
      visualization : school
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.visualization.getSchoolComparison));
}

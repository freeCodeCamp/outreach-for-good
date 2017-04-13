import VisualizationApi from '../api/VisualizationApi';

export function getCombined() {
  return dispatch => VisualizationApi.getCombined()
    .then(combined => dispatch({
      type          : 'DATA_VISUALIZATION_SUCCESS',
      visualization : combined
    }));
}

export function getSchoolComparison(schoolId) {
  return dispatch => VisualizationApi.getSchoolComparison(schoolId)
    .then(school => dispatch({
      type          : 'DATA_VISUALIZATION_SUCCESS',
      visualization : school
    }));
}

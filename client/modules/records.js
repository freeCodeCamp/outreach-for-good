import AbsenceRecordsApi from '../api/absence-records';

//ACTIONS
const CHANGE_TAB = 'CHANGE_TAB';
const FETCH_CURRENT_RECORD_SUCCESS = 'FETCH_CURRENT_RECORD_SUCCESS';
const ADD_RECORD_SUCCESS = 'ADD_RECORD_SUCCESS';
const REMOVE_RECORD_SUCCESS = 'REMOVE_RECORD_SUCCESS';

//REDUCER
const initialState = {
  view : {
    currentTab : 'upload'
  },
  current : []
};
export default function recordsReducer(state = initialState, action) {
  switch (action.type) {
  case CHANGE_TAB: {
    return {
      ...state,
      view : {
        currentTab : action.currentTab
      }
    };
  }
  case FETCH_CURRENT_RECORD_SUCCESS: {
    let current = action.current;
    return {
      ...state,
      current
    };
  }
  case ADD_RECORD_SUCCESS: {
    return {...state};
  }
  case REMOVE_RECORD_SUCCESS: {
    return {...state};
  }
  default: {
    return state;
  }
  }
}

//ACTION CREATORS
export function changeTab(tab) {
  return {
    type       : CHANGE_TAB,
    currentTab : tab
  };
}

export function fetchRecords() {
  return dispatch => AbsenceRecordsApi.fetchRecords()
    .then(current => dispatch({
      type : FETCH_CURRENT_RECORD_SUCCESS,
      current
    }));
}

// export function addRecord(record) {
//   return dispatch => AbsenceRecordsApi.addRecord(record)
//     .then(response => {
//       dispatch({
//         type : ADD_RECORD_SUCCESS
//       });
//       dispatch({
//         type      : 'OPEN_SNACKBAR',
//         message   : `Record created for ${response.record.school.name} with ${response.outreaches.length} outreaches.`,
//         snackType : 'success'
//       });
//     })
//     .catch(err => dispatch({
//       type      : 'OPEN_SNACKBAR',
//       message   : `Error: ${err}`,
//       snackType : 'error'
//     }));
// }
//
// export function removeRecord(record) {
//   return dispatch => AbsenceRecordsApi.removeRecord(record)
//     .then(() => {
//       dispatch({
//         type : REMOVE_RECORD_SUCCESS
//       });
//       dispatch({
//         type    : 'OPEN_SNACKBAR',
//         message : 'Record deleted.',
//         type    : 'success'
//       });
//     });
// }

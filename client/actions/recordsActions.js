import * as types from './actionTypes';
import AbsenceRecordsApi from '../api/AbsenceRecordsApi';

export function changeTab(tab) {
  return {
    type       : 'CHANGE_TAB',
    currentTab : tab
  };
}

export function fetchRecords() {
  return dispatch => AbsenceRecordsApi.fetchRecords()
    .then(current => dispatch({
      type : types.FETCH_CURRENT_RECORD_SUCCESS,
      current
    }));
}

export function addRecord(record) {
  return dispatch => AbsenceRecordsApi.addRecord(record)
    .then(() => dispatch({
      type : 'ADD_RECORD_SUCCESS'
    }));
}

export function removeRecord(record) {
  return dispatch => AbsenceRecordsApi.removeRecord(record)
    .then(() => dispatch({
      type : 'REMOVE_RECORD_SUCCESS'
    }));
}

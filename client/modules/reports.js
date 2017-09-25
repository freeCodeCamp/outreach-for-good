import Report from '../models/report';
import AbsenceRecordsApi from '../api/absence-records';
import StudentApi from '../api/students';
import { handleReducerError, errorMessage } from '../utils/error';

//ACTIONS
const RESET_REPORTS = 'RESET_REPORTS';
const AT_RISK_SUCCESS = 'AT_RISK_SUCCESS';
const CHRONICALLY_ABSENT_SUCCESS = 'CHRONICALLY_ABSENT_SUCCESS';
const OUTREACH_COUNT_SUCCESS = 'OUTREACH_COUNT_SUCCESS';
const OUTREACH_SUMMARY_SUCCESS = 'OUTREACH_SUMMARY_SUCCESS';
const INTERVENTION_SUMMARY_SUCCESS = 'INTERVENTION_SUMMARY_SUCCESS';

//REDUCER
const initialState = new Report();

export default function reportsReducer(state = initialState, action) {
  switch (action.type) {
  case RESET_REPORTS: {
    return initialState;
  }
  case AT_RISK_SUCCESS: {
    return initialState.setAtRisk(state, action.atRisk);
  }
  case CHRONICALLY_ABSENT_SUCCESS: {
    return initialState.setChronic(state, action.chronic);
  }
  case OUTREACH_COUNT_SUCCESS: {
    return initialState.setOutreachCounts(state, action.outreachCounts);
  }
  case OUTREACH_SUMMARY_SUCCESS: {
    return initialState.setOutreachSummary(state, action.outreachSummary);
  }
  case INTERVENTION_SUMMARY_SUCCESS: {
    return initialState.setInterventionSummary(state, action.interventionSummary);
  }
  default: {
    return state;
  }
  }
}

//ACTION CREATORS
export function resetReports() {
  return {type: RESET_REPORTS};
}

export function getCurrentAtRisk() {
  return dispatch => AbsenceRecordsApi.fetchRecordsListAtRisk()
    .then(atRisk => dispatch({
      type : AT_RISK_SUCCESS,
      atRisk
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.reports.getCurrentAtRisk));
}

export function getChronicallyAbsent() {
  return dispatch => AbsenceRecordsApi.fetchRecordsListChronic()
    .then(chronic => dispatch({
      type : CHRONICALLY_ABSENT_SUCCESS,
      chronic
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.reports.getChronicallyAbsent));
}

export function getOutreachCounts(querystring = '') {
  return dispatch => StudentApi.getOutreachCounts(querystring)
    .then(outreachCounts => dispatch({
      type : OUTREACH_COUNT_SUCCESS,
      outreachCounts
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.reports.getOutreachCounts));
}

export function getOutreachSummary() {
  return dispatch => StudentApi.getOutreachSummary()
    .then(outreachSummary => dispatch({
      type : OUTREACH_SUMMARY_SUCCESS,
      outreachSummary
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.reports.getOutreachSummary));
}

export function getInterventionSummary() {
  return dispatch => StudentApi.getInterventionSummary()
    .then(interventionSummary => dispatch({
      type : INTERVENTION_SUMMARY_SUCCESS,
      interventionSummary
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.reports.getInterventionSummary));
}

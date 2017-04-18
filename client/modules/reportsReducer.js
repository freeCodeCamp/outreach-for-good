import Report from '../models/ReportModel';
import AbsenceRecordsApi from './api/AbsenceRecordsApi';
import StudentApi from './api/StudentApi';

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
    }));
}

export function getChronicallyAbsent() {
  return dispatch => AbsenceRecordsApi.fetchRecordsListChronic()
    .then(chronic => dispatch({
      type : CHRONICALLY_ABSENT_SUCCESS,
      chronic
    }));
}

export function getOutreachCounts(querystring = '') {
  return dispatch => StudentApi.getOutreachCounts(querystring)
    .then(outreachCounts => dispatch({
      type : OUTREACH_COUNT_SUCCESS,
      outreachCounts
    }));
}

export function getOutreachSummary() {
  return dispatch => StudentApi.getOutreachSummary()
    .then(outreachSummary => dispatch({
      type : OUTREACH_SUMMARY_SUCCESS,
      outreachSummary
    }));
}

export function getInterventionSummary() {
  return dispatch => StudentApi.getInterventionSummary()
    .then(interventionSummary => dispatch({
      type : INTERVENTION_SUMMARY_SUCCESS,
      interventionSummary
    }));
}

import AbsenceRecordsApi from '../api/AbsenceRecordsApi';
import StudentApi from '../api/StudentApi';

export function getCurrentAtRisk() {
  return dispatch => AbsenceRecordsApi.fetchRecordsListAtRisk()
    .then(atRisk => dispatch({
      type : 'AT_RISK_SUCCESS',
      atRisk
    }));
}

export function getChronicallyAbsent() {
  return dispatch => AbsenceRecordsApi.fetchRecordsListChronic()
    .then(chronic => dispatch({
      type : 'CHRONICALLY_ABSENT_SUCCESS',
      chronic
    }));
}

export function getOutreachCounts(querystring = '') {
  return dispatch => StudentApi.getOutreachCounts(querystring)
    .then(outreachCounts => dispatch({
      type : 'OUTREACH_COUNT_SUCCESS',
      outreachCounts
    }));
}

export function getOutreachSummary() {
  return dispatch => StudentApi.getOutreachSummary()
    .then(outreachSummary => dispatch({
      type : 'OUTREACH_SUMMARY_SUCCESS',
      outreachSummary
    }));
}

export function getInterventionSummary() {
  return dispatch => StudentApi.getInterventionSummary()
    .then(interventionSummary => dispatch({
      type : 'INTERVENTION_SUMMARY_SUCCESS',
      interventionSummary
    }));
}

import * as types from './actionTypes';
import StudentApi from '../api/StudentApi';

export function getStudent(studentId) {
  return dispatch => StudentApi.getStudent(studentId)
    .then(student => dispatch({
      type : types.GET_STUDENT_SUCCESS,
      student
    }));
}

export function getStudentRecords(studentId) {
  return dispatch => StudentApi.getStudentRecords(studentId)
    .then(records => dispatch({
      type : types.GET_STUDENT_RECORDS_SUCCESS,
      records
    }));
}

export function getOutreachCounts() {
  return dispatch => StudentApi.getOutreachCounts()
    .then(outreachCounts => dispatch({
      type : types.GET_OUTREACH_COUNTS_SUCCESS,
      outreachCounts
    }));
}

export function getInterventionSummary() {
  return dispatch => StudentApi.getInterventionSummary()
    .then(interventionSummary => dispatch({
      type : types.GET_INTERVENTION_SUMMARY_SUCCESS,
      interventionSummary
    }));
}

export function getOutreachSummary() {
  return dispatch => StudentApi.getOutreachSummary()
    .then(outreachSummary => dispatch({
      type : types.GET_OUTREACH_SUMMARY_SUCCESS,
      outreachSummary
    }));
}

export function getStudentInterventions(studentId) {
  return dispatch => StudentApi.getStudentInterventions(studentId)
    .then(interventions => dispatch({
      type : types.GET_STUDENT_INTERVENTIONS_SUCCESS,
      interventions
    }));
}

export function getStudentOutreaches(studentId) {
  return dispatch => StudentApi.getStudentOutreaches(studentId)
    .then(outreaches => dispatch({
      type : types.GET_STUDENT_OUTREACHES_SUCCESS,
      outreaches
    }));
}

export function getStudentNotes(studentId) {
  return dispatch => StudentApi.getStudentNotes(studentId)
    .then(notes => dispatch({
      type : types.GET_STUDENT_NOTES_SUCCESS,
      notes
    }));
}

export function unmountStudent() {
  return {
    type : types.UNMOUNT_STUDENT
  };
}

import StudentApi from '../api/students';
import {openSnackbar} from './view';
import { handleReducerError, errorMessage } from '../utils/error';


//ACTIONS
const GET_OUTREACH_SUMMARY_SUCCESS = 'GET_OUTREACH_SUMMARY_SUCCESS';
const GET_OUTREACH_COUNTS_SUCCESS = 'GET_OUTREACH_COUNTS_SUCCESS';
const GET_INTERVENTION_SUMMARY_SUCCESS = 'GET_INTERVENTION_SUMMARY_SUCCESS';
const GET_STUDENT_SUCCESS = 'GET_STUDENT_SUCCESS';
const GET_STUDENT_RECORDS_SUCCESS = 'GET_STUDENT_RECORDS_SUCCESS';
const GET_STUDENT_INTERVENTIONS_SUCCESS = 'GET_STUDENT_INTERVENTIONS_SUCCESS';
const GET_STUDENT_OUTREACHES_SUCCESS = 'GET_STUDENT_OUTREACHES_SUCCESS';
const GET_STUDENT_NOTES_SUCCESS = 'GET_STUDENT_NOTES_SUCCESS';

const UNMOUNT_STUDENT = 'UNMOUNT_STUDENT';


//REDUCER
const initialState = {
  student        : {},
  absenceRecords : [],
  interventions  : [],
  outreaches     : [],
  notes          : []
};
export default function studentReducer(state = initialState, action) {
  switch (action.type) {
  case GET_STUDENT_SUCCESS: {
    return {
      ...state,
      student : action.student
    };
  }
  case GET_STUDENT_RECORDS_SUCCESS: {
    return {
      ...state,
      records : action.records
    };
  }
  case GET_STUDENT_INTERVENTIONS_SUCCESS: {
    return {
      ...state,
      interventions : action.interventions
    };
  }
  case GET_STUDENT_OUTREACHES_SUCCESS: {
    return {
      ...state,
      outreaches : action.outreaches
    };
  }
  case GET_STUDENT_NOTES_SUCCESS: {
    return {
      ...state,
      notes : action.notes
    };
  }
  case UNMOUNT_STUDENT: {
    let record = {};
    return {
      ...state,
      record
    };
  }
  default: {
    return state;
  }
  }
}

//ACTION CREATORS
export function getStudent(studentId) {
  return dispatch => StudentApi.getStudent(studentId)
    .then(student => dispatch({
      type : GET_STUDENT_SUCCESS,
      student
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.getStudent));

}

export function getStudentRecords(studentId) {
  return dispatch => StudentApi.getStudentRecords(studentId)
    .then(records => dispatch({
      type : GET_STUDENT_RECORDS_SUCCESS,
      records
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.getStudentRecords));
}

export function getOutreachCounts() {
  return dispatch => StudentApi.getOutreachCounts()
    .then(outreachCounts => dispatch({
      type : GET_OUTREACH_COUNTS_SUCCESS,
      outreachCounts
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.getOutreachCounts));
}

export function getInterventionSummary() {
  return dispatch => StudentApi.getInterventionSummary()
    .then(interventionSummary => dispatch({
      type : GET_INTERVENTION_SUMMARY_SUCCESS,
      interventionSummary
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.getInterventionSummary));
}

export function getOutreachSummary() {
  return dispatch => StudentApi.getOutreachSummary()
    .then(outreachSummary => dispatch({
      type : GET_OUTREACH_SUMMARY_SUCCESS,
      outreachSummary
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.getOutreachSummary));
}

export function getStudentInterventions(studentId) {
  return dispatch => StudentApi.getStudentInterventions(studentId)
    .then(interventions => dispatch({
      type : GET_STUDENT_INTERVENTIONS_SUCCESS,
      interventions
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.getStudentInterventions));
}

export function postStudentIntervention(studentId, body) {
  return dispatch => StudentApi.postStudentIntervention(studentId, body)
    .then(intervention => dispatch({
      type : 'POST_INTERVENTION_SUCCESS',
      intervention
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.postStudentIntervention));
}

export function getStudentOutreaches(studentId) {
  return dispatch => StudentApi.getStudentOutreaches(studentId)
    .then(outreaches => dispatch({
      type : GET_STUDENT_OUTREACHES_SUCCESS,
      outreaches
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.getStudentOutreaches));
}

export function getStudentNotes(studentId) {
  return dispatch => StudentApi.getStudentNotes(studentId)
    .then(notes => dispatch({
      type : GET_STUDENT_NOTES_SUCCESS,
      notes
    }))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.getStudentNotes));
}

export function postStudentNote(studentId, body) {
  return dispatch => StudentApi.postStudentNote(studentId, body)
    .then(() => StudentApi.getStudentNotes(studentId)
    .then(notes => dispatch({
      type : GET_STUDENT_NOTES_SUCCESS,
      notes
    })))
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.postStudentNote));
}

export function putStudentIep(studentIds, iep) {
  return dispatch => StudentApi.putStudentIep(Array.isArray(studentIds)
    ? studentIds : [studentIds], iep)
    .then(student => {
      dispatch(openSnackbar(student[0].iep ? 'Student IEP status added' : 'Student IEP status removed'));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.putStudentIep));
}

export function putStudentCfa(studentIds, cfa) {
  return dispatch => StudentApi.putStudentCfa(Array.isArray(studentIds)
    ? studentIds : [studentIds], cfa)
    .then(student => {
      dispatch(openSnackbar(student[0].cfa ? 'Student CFA status added' : 'Student CFA status removed'));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.putStudentCfa));
}

export function putStudentWithdrawn(studentIds, withdrawn) {
  return dispatch => StudentApi.putStudentWithdrawn(Array.isArray(studentIds)
    ? studentIds : [studentIds], withdrawn)
    .then(student => {
      dispatch(openSnackbar(student[0].withdrawn ? 'Student set to Withdrawn' : 'Student set to Enrolled'));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.putStudentWithdrawn));
}

export function postOutreachNote(studentId, outreachId, note) {
  return dispatch => StudentApi.postOutreachNote(studentId, outreachId, note)
    .then(outreach => {
      dispatch(getStudentOutreaches(studentId));
      dispatch(openSnackbar(`Outreach posted for ${outreach.type} ${outreach.tier}`));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.postOutreachNote));
}

export function postIntervention(studentId, intervention) {
  return dispatch => StudentApi.postIntervention(studentId, intervention)
    .then(response => {
      const date = new Date(response.createdDate).toDateString();

      dispatch(getStudentInterventions(studentId));
      dispatch(openSnackbar(`Intervention of type '${intervention.type}' created on ${date}`));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.postIntervention));
}

export function postInterventionNote(studentId, interventionId, note) {
  return dispatch => StudentApi.postInterventionNote(studentId, interventionId, note)
    .then(response => {
      dispatch(getStudentInterventions(studentId));
      dispatch(openSnackbar('Intervention note posted'));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.postInterventionNote));
}

export function deleteIntervention(studentId, interventionId) {
  return dispatch => StudentApi.deleteIntervention(studentId, interventionId)
    .then(response => {
      dispatch(getStudentInterventions(studentId));
      dispatch(openSnackbar('Intervention deleted'));
    })
    .catch(err => handleReducerError(err, dispatch, errorMessage.student.deleteIntervention));
}


export function unmountStudent() {
  return {
    type : UNMOUNT_STUDENT
  };
}

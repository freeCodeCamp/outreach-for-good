import StudentApi from '../api/students';
import {openSnackbar} from './view';


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
  student       : {},
  records       : [],
  interventions : [],
  outreaches    : [],
  notes         : []
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
    }));
}

export function getStudentRecords(studentId) {
  return dispatch => StudentApi.getStudentRecords(studentId)
    .then(records => dispatch({
      type : GET_STUDENT_RECORDS_SUCCESS,
      records
    }));
}

export function getOutreachCounts() {
  return dispatch => StudentApi.getOutreachCounts()
    .then(outreachCounts => dispatch({
      type : GET_OUTREACH_COUNTS_SUCCESS,
      outreachCounts
    }));
}

export function getInterventionSummary() {
  return dispatch => StudentApi.getInterventionSummary()
    .then(interventionSummary => dispatch({
      type : GET_INTERVENTION_SUMMARY_SUCCESS,
      interventionSummary
    }));
}

export function getOutreachSummary() {
  return dispatch => StudentApi.getOutreachSummary()
    .then(outreachSummary => dispatch({
      type : GET_OUTREACH_SUMMARY_SUCCESS,
      outreachSummary
    }));
}

export function getStudentInterventions(studentId) {
  return dispatch => StudentApi.getStudentInterventions(studentId)
    .then(interventions => dispatch({
      type : GET_STUDENT_INTERVENTIONS_SUCCESS,
      interventions
    }));
}

export function postStudentIntervention(studentId, body) {
  return dispatch => StudentApi.postStudentIntervention(studentId, body)
    .then(intervention => dispatch({
      type : 'POST_INTERVENTION_SUCCESS',
      intervention
    }));
}

export function getStudentOutreaches(studentId) {
  return dispatch => StudentApi.getStudentOutreaches(studentId)
    .then(outreaches => dispatch({
      type : GET_STUDENT_OUTREACHES_SUCCESS,
      outreaches
    }));
}

export function getStudentNotes(studentId) {
  return dispatch => StudentApi.getStudentNotes(studentId)
    .then(notes => dispatch({
      type : GET_STUDENT_NOTES_SUCCESS,
      notes
    }));
}

export function postStudentNote(studentId, body) {
  return dispatch => StudentApi.postStudentNote(studentId, body)
    .then(() => StudentApi.getStudentNotes(studentId)
    .then(notes => dispatch({
      type : GET_STUDENT_NOTES_SUCCESS,
      notes
    })));
}

export function putStudentIep(studentIds, iep) {
  return dispatch => StudentApi.putStudentIep(Array.isArray(studentIds)
    ? studentIds : [studentIds], iep)
    .then(student => {
      dispatch({
        type : GET_STUDENT_SUCCESS,
        student
      });
      dispatch(openSnackbar(`IEP status changed to ${student[0].iep}`));
    })
    .catch(err => showSnackbarErrorMessage(err));
}

export function putStudentCfa(studentIds, cfa) {
  return dispatch => StudentApi.putStudentCfa(Array.isArray(studentIds)
    ? studentIds : [studentIds], cfa)
    .then(student => {
      dispatch({
        type : GET_STUDENT_SUCCESS,
        student
      });
      dispatch(openSnackbar(`CFA status changed to ${student[0].cfa}`));
    })
    .catch(err => showSnackbarErrorMessage(err));
}

export function putStudentWithdrawn(studentIds, withdrawn) {
  return dispatch => StudentApi.putStudentWithdrawn(Array.isArray(studentIds)
    ? studentIds : [studentIds], withdrawn)
    .then(student => {
      dispatch({
        type : GET_STUDENT_SUCCESS,
        student
      });
      dispatch(openSnackbar(`Withdrawn status changed to ${student[0].withdrawn}`));
    })
    .catch(err => showSnackbarErrorMessage(err));
}

export function postOutreachNote(studentId, outreachId, note) {
  return dispatch => StudentApi.postOutreachNote(studentId, outreachId, note)
    .then(outreach => {
      dispatch(getStudentOutreaches(studentId));
      dispatch(openSnackbar(`Outreach posted for ${outreach.type} ${outreach.tier}`));
    })
    .catch(err => showSnackbarErrorMessage(err));
}

export function postIntervention(studentId, intervention) {
  return dispatch => StudentApi.postIntervention(studentId, intervention)
    .then(response => {
      const date = new Date(response.createdDate).toDateString();

      dispatch(getStudentInterventions(studentId));
      dispatch(openSnackbar(`Intervention of type '${intervention.type}' created on ${date}`));
    })
    .catch(err => dispatch(showSnackbarErrorMessage(err)));
}

export function postInterventionNote(studentId, interventionId, note) {
  return dispatch => StudentApi.postInterventionNote(studentId, interventionId, note)
    .then(response => {
      dispatch(getStudentInterventions(studentId));
      dispatch(openSnackbar('Intervention note posted'));
    })
    .catch(err => dispatch(showSnackbarErrorMessage(err)));
}

export function deleteIntervention(studentId, interventionId) {
  return dispatch => StudentApi.deleteIntervention(studentId, interventionId)
    .then(response => {
      dispatch(getStudentInterventions(studentId));
      dispatch(openSnackbar('Intervention deleted'));
    })
    .catch(err => dispatch(showSnackbarErrorMessage(err)));
}


export function unmountStudent() {
  return {
    type : UNMOUNT_STUDENT
  };
}

const showSnackbarErrorMessage = err => openSnackbar(`ERR: ${err}`, 'error');

import StudentApi from './api/StudentApi';


//ACTIONS
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

export function unmountStudent() {
  return {
    type : UNMOUNT_STUDENT
  };
}

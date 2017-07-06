// import {openSnackbar} from './view';

const GET_VOLUNTEERS_SUCCESS = 'GET_VOLUNTEERS_SUCCESS';
const ADD_VOLUNTEER_SUCCESS = 'ADD_VOLUNTEER_SUCCESS';
const UPDATE_VOLUNTEER_SUCCESS = 'UPDATE_VOLUNTEER_SUCCESS';
const REMOVE_VOLUNTEER_SUCCESS = 'REMOVE_VOLUNTEER_SUCCESS';

const initialState = {
  volunteers : []
};
export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
  case GET_VOLUNTEERS_SUCCESS: {
    console.log(action.schoolId);
    return {
      ...state
    };
  }
  case ADD_VOLUNTEER_SUCCESS: {
    const {volunteer} = action;
    console.log(volunteer);
    return {
      ...state,
      volunteers : [...state.volunteers, action.volunteer]
    };
  }
  case REMOVE_VOLUNTEER_SUCCESS: {
    return {...state};
  }
  case UPDATE_VOLUNTEER_SUCCESS: {
    return {...state};
  }
  default: return state;
  }
}

export function getVolunteers(schoolId) {
  return dispatch => dispatch({
    type : GET_VOLUNTEERS_SUCCESS,
    schoolId
  });
}

export function addVolunteer(volunteer) {
  return dispatch => dispatch({
    type : ADD_VOLUNTEER_SUCCESS,
    volunteer
  });
}
//
// export function removeVolunteer(volunteerId) {
//   return {
//     type : REMOVE_VOLUNTEER_SUCCESS
//   };
// }
//
// export function updateVolunteer(volunteerId, volunteer) {
//   return {
//     type : UPDATE_VOLUNTEER_SUCCESS
//   };
// }

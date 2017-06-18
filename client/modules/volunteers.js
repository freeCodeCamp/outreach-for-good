import SettingsApi from '../api/settings';
import {openSnackbar} from './view';

const GET_VOLUNTEERS_SUCCESS = 'GET_VOLUNTEERS_SUCCESS';
const POST_VOLUNTEER_SUCCESS = 'POST_VOLUNTEER_SUCCESS';

const initialState = [];
export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
  case GET_VOLUNTEERS_SUCCESS: {
    return {
      ...state
    };
  }
  case POST_VOLUNTEER_SUCCESS: {
    return {
      ...state,
      volunteers : [...state.volunteers, action.volunteer]
    };
  }
  default: return state;
  }
}

export function getVolunteers() {
  return {
    type : GET_VOLUNTEERS_SUCCESS
  };
}

export function postVolunteer(volunteer) {
  return {
    type : POST_VOLUNTEER_SUCCESS,
    volunteer
  };
}

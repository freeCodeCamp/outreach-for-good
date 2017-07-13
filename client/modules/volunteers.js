// <<<<<<< HEAD
// import VolunteerApi from '../api/volunteers.js';
// import {openSnackbar} from './view';

// const GET_VOLUNTEERS_SUCCESS = 'GET_VOLUNTEERS_SUCCESS';
// const POST_VOLUNTEER_SUCCESS = 'POST_VOLUNTEER_SUCCESS';
// const PUT_VOLUNTEER_SUCCESS = 'PUT_VOLUNTEER_SUCCESS';
// const DELETE_VOLUNTEER_SUCCESS = 'DELETE_VOLUNTEER_SUCCESS';
// =======
// // import {openSnackbar} from './view';

// const GET_VOLUNTEERS_SUCCESS = 'GET_VOLUNTEERS_SUCCESS';
// const ADD_VOLUNTEER_SUCCESS = 'ADD_VOLUNTEER_SUCCESS';
// const UPDATE_VOLUNTEER_SUCCESS = 'UPDATE_VOLUNTEER_SUCCESS';
// const REMOVE_VOLUNTEER_SUCCESS = 'REMOVE_VOLUNTEER_SUCCESS';
// >>>>>>> 8d81fa2a7583b864906f776fd53bd53269bbdfac

// const initialState = {
//   volunteers : []
// };
// export default function settingsReducer(state = initialState, action) {
//   switch (action.type) {
//   case GET_VOLUNTEERS_SUCCESS: {
// <<<<<<< HEAD
//     console.log(action.volunteers);
// =======
//     console.log(action.schoolId);
// >>>>>>> 8d81fa2a7583b864906f776fd53bd53269bbdfac
//     return {
//       ...state,
//       volunteers : action.volunteers
//     };
//   }
// <<<<<<< HEAD
//   case POST_VOLUNTEER_SUCCESS: {
// =======
//   case ADD_VOLUNTEER_SUCCESS: {
// >>>>>>> 8d81fa2a7583b864906f776fd53bd53269bbdfac
//     const {volunteer} = action;
//     console.log(volunteer);
//     return {
//       ...state,
//       volunteers : [...state.volunteers, action.volunteer]
//     };
//   }
// <<<<<<< HEAD
//   case DELETE_VOLUNTEER_SUCCESS: {
//     return {...state};
//   }
//   case PUT_VOLUNTEER_SUCCESS: {
// =======
//   case REMOVE_VOLUNTEER_SUCCESS: {
//     return {...state};
//   }
//   case UPDATE_VOLUNTEER_SUCCESS: {
// >>>>>>> 8d81fa2a7583b864906f776fd53bd53269bbdfac
//     return {...state};
//   }
//   default: return state;
//   }
// }

// export function getVolunteers(schoolId) {
// <<<<<<< HEAD
//   return dispatch => VolunteerApi.getVolunteers(schoolId)
//     .then(volunteers => dispatch({
//       type : GET_VOLUNTEERS_SUCCESS,
//       volunteers
//     }));
// }

// export function postVolunteer(schoolId, volunteer) {
//   return dispatch => VolunteerApi.postVolunteer(schoolId, volunteer)
//     .then(res => {
//       getVolunteers(schoolId);
//       // dispatch({
//       //   type : POST_VOLUNTEER_SUCCESS
//       // });
//       dispatch(openSnackbar('Post success'));
//     });
// =======
//   return dispatch => dispatch({
//     type : GET_VOLUNTEERS_SUCCESS,
//     schoolId
//   });
// }

// export function addVolunteer(volunteer) {
//   return dispatch => dispatch({
//     type : ADD_VOLUNTEER_SUCCESS,
//     volunteer
//   });
// >>>>>>> 8d81fa2a7583b864906f776fd53bd53269bbdfac
// }
// //
// // export function removeVolunteer(volunteerId) {
// //   return {
// //     type : REMOVE_VOLUNTEER_SUCCESS
// //   };
// // }
// //
// // export function updateVolunteer(volunteerId, volunteer) {
// //   return {
// //     type : UPDATE_VOLUNTEER_SUCCESS
// //   };
// // }

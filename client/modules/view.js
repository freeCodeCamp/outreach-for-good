//ACTIONS
const TOGGLE_EXPAND_SIDEBAR = 'TOGGLE_EXPAND_SIDEBAR';
const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

//REDUCER
const initialState = {
  sidebar : {
    expand  : false,
    popover : false
  },
  snackbar : {
    autoHideDuration : 3000,
    message          : '',
    open             : false,
    snackType        : 'success'
  }
};
export default function viewReducer(state = initialState, action) {
  switch (action.type) {
  case TOGGLE_EXPAND_SIDEBAR:
    return {
      ...state,
      sidebar : {
        expand : action.open,
      }
    };
  case OPEN_SNACKBAR:
    return {
      ...state,
      snackbar : {
        autoHideDuration : 3000,
        message          : action.message,
        open             : true,
        snackType        : action.snackType
      }
    };
  case CLOSE_SNACKBAR:
    return {
      ...state,
      snackbar : {
        autoHideDuration : 3000,
        message          : '',
        open             : false,
        snackType        : 'success'
      }
    };
  default:
    return state;
  }
}

//ACTION CREATORS
export function setExpandSidebar(open = false) {
  return {type: TOGGLE_EXPAND_SIDEBAR, open};
}

export function openSnackbar(message = '', snackType = 'success') {
  return {type: OPEN_SNACKBAR, message, snackType};
}

export function closeSnackbar() {
  return {type: CLOSE_SNACKBAR};
}

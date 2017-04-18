//ACTIONS
const TOGGLE_EXPAND_SIDEBAR = 'TOGGLE_EXPAND_SIDEBAR';

//REDUCER
const initialState = {
  sidebar : {
    expand  : false,
    popover : false
  }
};
export default function viewReducer(state = initialState, action) {
  switch (action.type) {
  case TOGGLE_EXPAND_SIDEBAR:
    return {
      sidebar : {
        expand : action.open,
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

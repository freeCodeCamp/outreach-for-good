//actions
const SUCCESS_RESPONSE = 'SUCCESS_RESPONSE';
const FAILURE_RESPONSE = 'FAILURE_RESPONSE';

//reducer
const initialState = {
  open : false
};

export default function responseReducer(state = initialState, action) {
  switch (action.type) {
  case SUCCESS_RESPONSE:
    return {
      ...state,
      open : true
    };

  case FAILURE_RESPONSE:
    return { ...state, open: true};

  default: state;
  }
}

//action creators
export function successResponse() {
  return {type: SUCCESS_RESPONSE};
}

export function failureResponse() {
  return {type: FAILURE_RESPONSE};
}

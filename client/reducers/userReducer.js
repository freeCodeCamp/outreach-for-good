import * as types from '../actions/actionTypes';

import { List, fromJS } from 'immutable';
import User from '../models/UserModel';

const initialState = new List();

const mergeEntities = (state, newUsers) =>
  state.merge(newUsers.map(user => new User(user)));

export default (state = initialState, action) => {
  switch (action.type) {
  // Received users from getAllUsers()
  case types.LOAD_USERS_SUCCESS:
    return mergeEntities(state, fromJS(action.users));

  default:
    return state;
  }
};

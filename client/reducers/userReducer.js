import * as types from '../actions/actionTypes';

import { fromJS } from 'immutable';
import User from '../models/UserModel';
import UserList from '../models/UserListModel';

const initialState = new UserList();

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

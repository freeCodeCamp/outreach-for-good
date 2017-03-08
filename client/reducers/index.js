import { combineReducers } from 'redux';
import session from './sessionReducer';
import users from './userReducer';
import view from './viewReducer';

// ES6 short-hand property name (users: users)
const rootReducer = combineReducers({
  session,
  users,
  view
});

export default rootReducer;

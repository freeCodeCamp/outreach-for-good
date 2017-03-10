import { combineReducers } from 'redux';
import session from './sessionReducer';
import users from './userReducer';
import view from './viewReducer';
import records from './recordsReducer';

// ES6 short-hand property name (users: users)
const rootReducer = combineReducers({
  session,
  users,
  view,
  records
});

export default rootReducer;

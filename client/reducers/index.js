import { combineReducers } from 'redux';
import records from './recordsReducer';
import schools from './schoolReducer';
import session from './sessionReducer';
import student from './studentReducer';
import users from './userReducer';
import view from './viewReducer';

// ES6 short-hand property name (users: users)
const rootReducer = combineReducers({
  view,
  records,
  schools,
  session,
  student,
  users
});

export default rootReducer;

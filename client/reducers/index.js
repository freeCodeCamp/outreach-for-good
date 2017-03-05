import { combineReducers } from 'redux';
import users from './userReducer';
import view from './viewReducer';

// ES6 short-hand property name (users: users)
const rootReducer = combineReducers({
  users,
  view
});

export default rootReducer;

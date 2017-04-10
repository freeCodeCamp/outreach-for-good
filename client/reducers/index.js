import { combineReducers } from 'redux';
import absenceRecords from './absenceRecordReducer';
import records from './recordsReducer';
import reports from './reportsReducer';
import schools from './schoolReducer';
import session from './sessionReducer';
import student from './studentReducer';
import users from './userReducer';
import view from './viewReducer';

// ES6 short-hand property name (users: users)
const rootReducer = combineReducers({
  view,
  absenceRecords,
  records,
  reports,
  schools,
  session,
  student,
  users
});

export default rootReducer;

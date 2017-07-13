import { combineReducers } from 'redux';

import absenceRecords from './absence-record';
import records from './records';
import reports from './reports';
import schools from './school';
import session from './session';
import settings from './settings';
import student from './student';
import users from './user';
import view from './view';
import visualization from './visualization';
import volunteers from './volunteers';

export const rootReducer = combineReducers({
  view,
  absenceRecords,
  records,
  reports,
  schools,
  session,
  settings,
  student,
  users,
  visualization,
  volunteers
});

export default rootReducer;

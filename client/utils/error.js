import { validate } from '../modules/session';
import { openSnackbar } from '../modules/view';

export const handleReducerError = (error, dispatch, message) => {
  let status = error.status;
  if(status == 401) {
    return dispatch(validate());
  } else if(message) {
    dispatch(openSnackbar(message, 'error'));
  }
  throw error;
};

export const errorMessage = {
  fetchRecords            : 'Error 01: Could not fetch absence records',
  fetchStudentRecord      : 'Error 02: Could not fetch absence records',
  fetchRecordsList        : 'Error 03: Could not fetch absence records',
  fetchRecordsListQuery   : 'Error 04: Could not fetch absence records',
  fetchRecordsListAtRisk  : 'Error 05: Could not fetch absence records',
  fetchRecordsListChronic : 'Error 06: Could not fetch absence records',
  fetchRecordsListYear    : 'Error 07: Could not fetch absence records',
  addRecord               : 'Error 08: Could not add record',
  removeRecord            : 'Error 09: Could not remove record',
};

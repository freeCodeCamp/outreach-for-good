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
  absenceRecord : {
    fetchRecords            : 'Error 01: Could not fetch absence records',
    fetchStudentRecord      : 'Error 02: Could not fetch absence records',
    fetchRecordsList        : 'Error 03: Could not fetch absence records',
    fetchRecordsListQuery   : 'Error 04: Could not fetch absence records',
    fetchRecordsListAtRisk  : 'Error 05: Could not fetch absence records',
    fetchRecordsListChronic : 'Error 06: Could not fetch absence records',
    fetchRecordsListYear    : 'Error 07: Could not fetch absence records',
    addRecord               : 'Error: Could not add absence record',
    removeRecord            : 'Error: Could not remove absence record'
  },
  records : {
    fetchRecords          : 'Error 10: Could not fetch absence records',
    fetchSchoolRecordList : 'Error: Could not fetch school record list'
  },
  reports : {
    getCurrentAtRisk       : 'Error: Could not fetch at risk reports',
    getChronicallyAbsent   : 'Error: Could not fetch chronically absent reports',
    getOutreachCounts      : 'Error: Could not fetch outreach counts',
    getOutreachSummary     : 'Error: Could not fetch outreach summary',
    getInterventionSummary : 'Error: Could not fetch intervention summary'
  },
  school : {
    getSchoolNames : 'Error: Could not fetch school names',
    getSchool      : 'Error: Could not fetch school',
    getAllSchools  : 'Error: Could not fetch all schools',
    addSchool      : 'Error: Could not add school',
    removeSchool   : 'Error: Could not remove school',
    changeTriggers : 'Error: Could not update triggers'
  },
  settings : {
    setWithdrawnStudents   : 'Error: Could not set withdrawn',
    getInterventionTypes   : 'Error: Could not fetch intervention types',
    putInterventionType    : 'Error: Could not update intervention type',
    postInterventionType   : 'Error: Could not set intervention type',
    deleteInterventionType : 'Error: Could not remove intervention type'
  },
  student : {
    getStudent              : 'Error: Could not fetch student',
    getStudentRecords       : 'Error: Could not fetch student records',
    getOutreachCounts       : 'Error: Could not fetch student outreach counts',
    getInterventionSummary  : 'Error: Could not fetch student intervention',
    getOutreachSummary      : 'Error: Could not fetch student outreach',
    getStudentInterventions : 'Error: Could not fetch student interventions',
    postStudentIntervention : 'Error: Could not set student intervention',
    getStudentOutreaches    : 'Error: Could not fetch student outreaches',
    getStudentNotes         : 'Error: Could not fetch student notes',
    postStudentNote         : 'Error: Could not set student note',
    putStudentIep           : 'Error: Could not update student IEP status',
    putStudentCfa           : 'Error: Could not update student CFA status',
    putStudentWithdrawn     : 'Error: Could not update student withdrawn status',
    postOutreachNote        : 'Error: Could not set outreach note',
    postIntervention        : 'Error: Could not set student intervention',
    postInterventionNote    : 'Error: Could not set intervention note',
    deleteIntervention      : 'Error: Could not remove student intervention'
  },
  user : {
    getMyself        : 'Error: Could not fetch your profile',
    getUser          : 'Error: Could not fetch user profile',
    getAllUsers      : 'Error: Could not fetch all profiles',
    updateUserRole   : 'Error: Could not update user role',
    updateUserSchool : 'Error: Could not update user school',
    removeUser       : 'Error: Could not remove user'
  },
  visualization : {
    getCombined         : 'Error: Could not fetch combined schools',
    getSchoolComparison : 'Error: Could not fetch school comparison'
  }
};

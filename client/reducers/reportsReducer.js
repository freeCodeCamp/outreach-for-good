import Report from '../models/ReportModel';

const initialState = new Report();

export default function reportsReducer(state = initialState, action) {
  switch (action.type) {
  case 'RESET_REPORTS': {
    return initialState;
  }
  case 'AT_RISK_SUCCESS': {
    return initialState.setAtRisk(state, action.atRisk);
  }
  case 'CHRONICALLY_ABSENT_SUCCESS': {
    return initialState.setChronic(state, action.chronic);
  }
  case 'OUTREACH_COUNT_SUCCESS': {
    return initialState.setOutreachCounts(state, action.outreachCounts);
  }
  case 'OUTREACH_SUMMARY_SUCCESS': {
    return initialState.setOutreachSummary(state, action.outreachSummary);
  }
  case 'INTERVENTION_SUMMARY_SUCCESS': {
    return initialState.setInterventionSummary(state, action.interventionSummary);
  }
  default: {
    return state;
  }
  }
}

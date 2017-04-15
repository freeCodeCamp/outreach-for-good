// import * as types from '../actions/actionTypes';
import {List, fromJS, Record} from 'immutable';
// import initialState from './initialState';
// const initialState = new List();

import Report from '../models/ReportModel';

const initialState = new Report();

export default function reportsReducer(state = initialState, action) {
  switch (action.type) {
  case 'AT_RISK_SUCCESS': {
    return {
      ...state,
      atRisk : fromJS(action.atRisk)
        .map(student => new Record(student))
    };
  }
  case 'CHRONICALLY_ABSENT_SUCCESS': {
    return {
      ...state,
      chronic : fromJS(action.chronic)
        .map(student => new Record(student))
    };
  }
  case 'OUTREACH_COUNT_SUCCESS': {
    return initialState.setOutreachCounts(state, action.outreachCounts);
  }
  case 'OUTREACH_SUMMARY_SUCCESS': {
    return {
      ...state,
      outreachSummary : fromJS(action.outreachSummary)
        .map(student => new Record(student))
    };
  }
  case 'INTERVENTION_SUMMARY_SUCCESS': {
    return {
      ...state,
      interventionSummary : fromJS(action.interventionSummary)
        .map(student => new Record(student))
    };
  }
  default: {
    return state;
  }
  }
}

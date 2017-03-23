import * as types from '../actions/actionTypes';

import { List, fromJS } from 'immutable';
import School from '../models/SchoolModel';

const initialState = new List();

const mergeEntities = (state, newSchools) =>
  state.merge(newSchools.map(school => new School(school)));

export default (state = initialState, action) => {
  switch (action.type) {
  // Received schools from getAllSchools()
  case types.LOAD_SCHOOLS_SUCCESS:
    return mergeEntities(state, fromJS(action.schools));

  default:
    return state;
  }
};

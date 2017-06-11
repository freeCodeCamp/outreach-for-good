import Immutable from 'immutable';

import AbsenceRecord from './absence-record';
import InterventionSummary from './intervention-summary';
import OutreachSummary from './outreach-summary';

const ReportModel = Immutable.Record({
  atRisk              : Immutable.List(),
  chronicAbsent       : Immutable.List(),
  outreachCounts      : Immutable.Map(),
  outreachSummary     : Immutable.List(),
  interventionSummary : Immutable.List(),
});

class Report extends ReportModel {
  /**
   * Convert JSON Absence Records to Immutable AbsenceRecord
   */
  setAtRisk(currentState, atRisk) {
    return currentState.update('atRisk', i =>
      i.clear().merge(Immutable.fromJS(atRisk)
        .map(record => new AbsenceRecord(record)))
    );
  }
  /**
   * Convert JSON Absence Records to Immutable AbsenceRecord
   */
  setChronic(currentState, chronic) {
    return currentState.update('chronicAbsent', i =>
      i.clear().merge(Immutable.fromJS(chronic)
        .map(record => new AbsenceRecord(record)))
    );
  }
  /**
   * Convert array of objects, to flattened Immutable Map
   */
  setInterventionSummary(currentState, interventionSummary) {
    return currentState.update('interventionSummary', i =>
      i.clear().merge(Immutable.fromJS(interventionSummary)
        .map(record => new InterventionSummary(record)))
    );
  }
  /**
   * Convert array of objects, to flattened Immutable Map
   */
  setOutreachCounts(currentState, outreachCounts) {
    let countMap = {};
    outreachCounts.forEach(i => {
      countMap[i._id.replace(/ /g, '')] = i.count;
    });
    return currentState.update('outreachCounts', i => i.clear().merge(countMap));
  }
  /**
   * Convert array of objects, to flattened Immutable Map
   */
  setOutreachSummary(currentState, outreachSummary) {
    return currentState.update('outreachSummary', i =>
      i.clear().merge(Immutable.fromJS(outreachSummary)
        .map(record => new OutreachSummary(record)))
    );
  }
}

export default Report;

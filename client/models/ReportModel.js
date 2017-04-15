import Immutable from 'immutable';
import AbsenceRecord from './AbsenceRecordModel';

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
  setOutreachCounts(currentState, outreachCounts) {
    let countMap = {};
    outreachCounts.forEach(i => {
      countMap[i._id.replace(/ /g, '')] = i.count;
    });
    return currentState.update('outreachCounts', i => i.clear().merge(countMap));
  }
}

export default Report;

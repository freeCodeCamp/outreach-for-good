import Immutable from 'immutable';
import AbsenceRecord from './AbsenceRecordModel';

const ReportModel = Immutable.Record({
  atRisk              : Immutable.List(),
  chronic             : Immutable.List(),
  outreachCounts      : Immutable.Map(),
  outreachSummary     : Immutable.List(),
  interventionSummary : Immutable.List(),
});

class Report extends ReportModel {
  /**
   * Takes JS array, converts to Immutable Map
   */
  setOutreachCounts(currentState, outreachCounts) {
    let countMap = {};
    outreachCounts.forEach(i => {
      countMap[i._id.replace(/ /g, '')] = i.count;
    });
    return currentState.update('outreachCounts', i => i.clear().merge(countMap));
  }
  /**
   * Takes JS array, converts to Immutable Map
   */
  setAtRisk(currentState, atRisk) {
    let countMap = {};
    outreachCounts.forEach(i => {
      countMap[i._id.replace(/ /g, '')] = i.count;
    });
    return currentState.update('outreachCounts', i => i.clear().merge(countMap));
  }
}

export default Report;

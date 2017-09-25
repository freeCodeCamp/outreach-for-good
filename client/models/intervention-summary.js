import Immutable from 'immutable';

const InterventionSummaryModel = Immutable.Record({

});

class InterventionSummary extends InterventionSummaryModel {
  /*
   * Take an object of depth 2 (Example: {a: 1, b: {c: 2, d: 3}} )
   *   and flatten it to: {a: 1, b.c: 2, b.d: 3}
   */
  constructor(record) {
    super(record);
    return record.flatMap((v, k) => {
      let nv = Immutable.Map.isMap(v)
        ? v.flatMap((vv, kk) => ({[`${k}.${kk}`]: vv})) : v;
      return {[k]: nv};
    }).flatten(true);
  }
}

export default InterventionSummary;

import Immutable from 'immutable';

const OutreachSummaryModel = Immutable.Record({

});

class OutreachSummary extends OutreachSummaryModel {
  /*
   * Take an object of depth 2 (Example: {a: 1, b: {c: 2, d: 3}} )
   *   and flatten it to: {a: 1, b.c: 2, b.d: 3}
   *   - special case: { .. "counts": [] ..}
   */
  constructor(record) {
    super(record);
    let entries = {};
    record.get('counts').forEach(entry => {
      entries[entry.get('type').replace(/ /g, '')] = entry;
    });
    return record.merge(entries).delete('counts')
      .flatMap((v, k) => {
        let nv = Immutable.Map.isMap(v)
          ? v.flatMap((vv, kk) => ({[`${k}.${kk}`]: vv})) : v;
        return {[k]: nv};
      })
      .flatten(true);
  }
}

export default OutreachSummary;

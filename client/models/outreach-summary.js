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
    let nextRecord = record;
    let total = {count: 0, resolved: 0, outstanding: 0};
    ['PhoneCall', 'LetterSent', 'HomeVisit', 'SSTReferral', 'CourtReferral'].forEach(outreachType => {
      let outreach = nextRecord.get('counts').filter(o => o.get('type').replace(/ /g, '') === outreachType);
      nextRecord = nextRecord.set(`${outreachType}.count`, outreach.first() && outreach.first().get('count') || 0);
      total.count += outreach.first() && outreach.first().get('count') || 0;
      nextRecord = nextRecord.set(`${outreachType}.resolved`, outreach.first() && outreach.first().get('resolved') || 0);
      total.count += outreach.first() && outreach.first().get('resolved') || 0;
      nextRecord = nextRecord.set(`${outreachType}.outstanding`, outreach.first() && outreach.first().get('outstanding') || 0);
      total.count += outreach.first() && outreach.first().get('outstanding') || 0;
    });
    nextRecord = nextRecord.delete('counts');
    nextRecord = nextRecord.set('total.count', total.count);
    nextRecord = nextRecord.set('total.resolved', total.resolved);
    nextRecord = nextRecord.set('total.outstanding', total.outstanding);
    return nextRecord.flatMap((v, k) => {
      let nv = Immutable.Map.isMap(v)
        ? v.flatMap((vv, kk) => ({[`${k}.${kk}`]: vv})) : v;
      return {[k]: nv};
    }).flatten(true);
  }
}

export default OutreachSummary;

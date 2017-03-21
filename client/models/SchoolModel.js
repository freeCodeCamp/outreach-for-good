import Immutable from 'immutable';

const SchoolRecord = Immutable.Record({
  _id      : '',
  provider : 'local',
  name     : '',
  email    : '',
  role     : 'guest',
});

// This extension is not needed yet
// but left in for reference
class School extends SchoolRecord {
  isDone() {
    return this.get('done');
  }

  getLabel() {
    return this.get('name') || 'New School';
  }
}

export default School;

import Immutable from 'immutable';

const SchoolRecord = Immutable.Record({
  _id      : '',
  name     : '',
  active   : '',
  triggers : [],
});

// This extension is not needed yet
// but left in for reference
class School extends SchoolRecord {


}

export default School;

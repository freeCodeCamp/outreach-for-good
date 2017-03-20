import Immutable from 'immutable';

const UserRecord = Immutable.Record({
  _id      : '',
  provider : 'local',
  name     : '',
  email    : '',
  role     : 'guest',
});

// This extension is not needed yet
// but left in for reference
class User extends UserRecord {
  isDone() {
    return this.get('done');
  }

  getLabel() {
    return this.get('name') || 'New User';
  }
}

export default User;

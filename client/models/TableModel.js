import Immutable from 'immutable';

export const Table = Immutable.Record({
  title         : '',
  rowHeight     : 35,
  headerHeight  : 35,
  selectedTab   : '',
  selectedIndex : Immutable.List(),
  selectedData  : Immutable.List(),
  openMenus     : {
    edit   : false,
    anchor : null
  },
  openDialogs : {
    editSchool : false,
    editRole   : false,
    removeUser : false,
  },
});

class TableModel extends Table {
  toggleSelectedIndex(currentState, index) {
    let target = currentState.get('selectedIndex').indexOf(index);
    if(target == -1) {
      return currentState.update('selectedIndex', i => i.push(index));
    } else {
      return currentState.update('selectedIndex', i => i.splice(target, 1));
    }
  }

  resetTable() {
    return TableModel;
  }

  setSelectedTab(currentState, name) {
    return currentState.set('selectedTab', name);
  }
}

export default TableModel;

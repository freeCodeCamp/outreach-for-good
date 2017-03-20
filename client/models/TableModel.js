import Immutable from 'immutable';

export const Table = Immutable.Record({
  title         : '',
  rowHeight     : 35,
  headerHeight  : 35,
  selectedTab   : '',
  selectedIndex : Immutable.List(),
  selectedData  : Immutable.List(),
  MuiPopovers   : Immutable.Map(),
  MuiDialogs    : Immutable.Map(),
  MuiAnchor     : null,
});

class TableModel extends Table {

  addPopovers(currentState, popoverValues) {
    return currentState.update('MuiPopovers', i => i.clear().merge(popoverValues));
  }

  togglePopovers(currentState, popoverValue) {
    return currentState.update('MuiPopovers', iMap =>
      iMap.update(popoverValue, state => !state));
  }

  setAnchor(currentState, anchor) {
    return currentState.set('MuiAnchor', anchor);
  }

  addDialogs(currentState, dialogValues) {
    return currentState.update('MuiDialogs', i => i.clear().merge(dialogValues));
  }

  toggleDialogs(currentState, dialogValue) {
    return currentState.update('MuiDialogs', iMap =>
      iMap.update(dialogValue, state => !state));
  }

  resetDialogs(currentState) {
    return currentState.update('MuiDialogs', iMap => iMap.map(() => false));
  }

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

  setSelectedData(currentState, data) {
    return currentState.update('selectedData', i => i.clear().merge(data));
  }

  setSelectedTab(currentState, name) {
    return currentState.set('selectedTab', name);
  }
}

// : { edit: true }
  // openDialogs : {
  //   editSchool : false,
  //   editRole   : false,
  //   removeUser : false,
  // },
export default TableModel;

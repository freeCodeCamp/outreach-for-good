import Immutable from 'immutable';
import * as locAct from '../components/common/data-table/localActions';

export const Table = Immutable.Record({
  title         : '',
  rowHeight     : 35,
  headerHeight  : 35,
  sortDirection : locAct.SORT_ASC,
  sortIndex     : '',
  selectedTab   : '',
  selectedIndex : Immutable.List(),
  selectedData  : Immutable.List(),
  MuiPopovers   : Immutable.Map(),
  MuiDialogs    : Immutable.Map(),
  MuiAnchor     : null,
});

class TableModel extends Table {

  setSelectedTab(currentState, name) {
    return currentState.set('selectedTab', name);
  }

  updateSortIndex(currentState, data) {
    let nextState = currentState.update('sortDirection', sortDir =>
      data == currentState.get('sortIndex')
      ? locAct.SORT_ASC == sortDir
        ? locAct.SORT_DESC : locAct.SORT_ASC : locAct.SORT_ASC);
    return nextState.update('sortIndex', () => data);
  }

  /**
   * Row Select and Highlighting
   */
  toggleSelectedRowIndex(currentState, index) {
    let target = currentState.get('selectedIndex').indexOf(index);
    if(target == -1) {
      return currentState.update('selectedIndex', i => i.push(index));
    } else {
      return currentState.update('selectedIndex', i => i.splice(target, 1));
    }
  }

  // Return data stored in selected rows
  setSelectedRowData(currentState, data) {
    return currentState.update('selectedData', i => i.clear().merge(data));
  }

  // Return string of comma seperated cell values (from selection)
  selectedRowsToCsv(currentState, column) {
    return currentState.get('selectedData')
      .map(row => row[column])
      .join(', ');
  }

  /**
   * Material-UI <Popover>
   */
  addPopovers(currentState, popoverValues) {
    return currentState.update('MuiPopovers', i => i.clear().merge(popoverValues));
  }

  togglePopovers(currentState, popoverValue) {
    return currentState.update('MuiPopovers', iMap =>
      iMap.update(popoverValue, state => !state));
  }

  resetPopovers(currentState) {
    return currentState.update('MuiPopovers', iMap => iMap.map(() => false));
  }

  // Set anchor element for <Popover> menu
  setAnchor(currentState, anchor) {
    return currentState.set('MuiAnchor', anchor);
  }

  /**
   * Material-UI <Dialog>
   */
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
}

export default TableModel;

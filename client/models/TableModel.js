import Immutable from 'immutable';
import * as locAct from '../components/common/data-table/localActions';

export const Table = Immutable.Record({
  title         : '',
  rowHeight     : 35,
  headerHeight  : 35,
  // relative to data indicies (not sorted with indexMap)
  selectedIndex : Immutable.List(),
  selectedData  : Immutable.List(),
  // data indicies -> sorted-table order map
  indexMap      : [],
  sortDirection : locAct.SORT_ASC,
  sortCol       : '',
  selectedTab   : '',
  MuiPopovers   : Immutable.Map(),
  MuiDialogs    : Immutable.Map(),
  MuiAnchor     : null,
});

class TableModel extends Table {

  setSelectedTab(currentState, name) {
    return currentState.set('selectedTab', name);
  }

  /**
   * Sort table by column
   */
  buildIndexMap(currentState, data) {
    return currentState.update('indexMap', () =>
      Array(data.size).fill(0)
      .map((x, i) => i));
  }

  updateSortCol(currentState, nextSortCol) {
    let nextState = currentState.update('sortDirection', sortDir =>
      nextSortCol == currentState.get('sortCol')
      ? locAct.SORT_ASC == sortDir
        ? locAct.SORT_DESC : locAct.SORT_ASC : locAct.SORT_ASC);
    return nextState.update('sortCol', () => nextSortCol);
  }

  updateIndexMap(currentState, data) {
    let sortCol = currentState.get('sortCol');
    let sortDirection = currentState.get('sortDirection') == locAct.SORT_ASC;
    return currentState.update('indexMap', indexMap =>
      indexMap.sort((xIndex, yIndex) => {
        let xValue = data.getIn([xIndex, sortCol]);
        let yValue = data.getIn([yIndex, sortCol]);
        return xValue > yValue
          ? sortDirection ? 1 : -1
          : sortDirection ? -1 : 1;
      })
    );
  }

  /**
   * Row Select and Highlighting
   */
  toggleSelectedRowIndex(currentState, mappedIndex) {
    let target = this.selectionToMappedIndicies(currentState).indexOf(mappedIndex);
    if(target == -1) {
      let index = currentState.get('indexMap')[mappedIndex];
      return currentState.update('selectedIndex', i => i.push(index));
    } else {
      return currentState.update('selectedIndex', i => i.splice(target, 1));
    }
  }

  // Returns `selectedIndex` mapped to table sort order
  selectionToMappedIndicies(currentState) {
    let indexMap = currentState.get('indexMap');
    return currentState
      .get('selectedIndex').map(index =>
        indexMap.indexOf(index));
  }

  clearSelectedRows(currentState) {
    return currentState.update('selectedIndex', i => i.clear());
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

  updateSortIndex(currentState, nextSortIndex) {
    let nextState = currentState.update('sortDirection', sortDir =>
      nextSortIndex == currentState.get('sortIndex')
      ? locAct.SORT_ASC == sortDir
        ? locAct.SORT_DESC : locAct.SORT_ASC : locAct.SORT_ASC);
    return nextState.update('sortIndex', () => nextSortIndex);
  }

  updateIndexMap(currentState, data) {
    let sortIndex = currentState.get('sortIndex');
    let sortDirection = currentState.get('sortDirection') == locAct.SORT_ASC;
    return currentState.update('indexMap', indexMap =>
      indexMap.sort((xIndex, yIndex) => {
        let xValue = data.getIn([xIndex, sortIndex]);
        let yValue = data.getIn([yIndex, sortIndex]);
        return xValue > yValue
          ? sortDirection ? 1 : -1
          : sortDirection ? -1 : 1;
      })
    );
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

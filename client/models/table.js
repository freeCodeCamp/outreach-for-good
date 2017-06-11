import Immutable from 'immutable';

import * as locAct from '../components/data-table/data-table.actions';

export const Table = Immutable.Record({
  selectedTab   : '',
  title         : '',
  rowHeight     : 35,
  headerHeight  : 35,
  // relative to data indicies (not sorted with indexMap)
  selectedIndex : Immutable.List(),
  selectedData  : Immutable.List(),
  // data indicies -> sorted-table order map
  indexMap      : Immutable.List(),
  sortDirection : locAct.SORT_ASC,
  sortCol       : '',
  filterEnabled : false,
  // fixedGroup: {column: xx, summaryRow: {index: xx, count: xx}}
  fixedGroup    : Immutable.Map({
    column   : '',
    indices  : Immutable.List(),
    rowCount : Immutable.Map({
      total : ''
    })
  }),
  // filterBy: {data_id: filter_value, ...}
  filterBy    : Immutable.Map(),
  // used to display MaterialUI Components
  MuiPopovers : Immutable.Map(),
  MuiDialogs  : Immutable.Map(),
  MuiAnchor   : null,
});

class TableModel extends Table {

  setSelectedTab(currentState, name) {
    return currentState.set('selectedTab', name);
  }

  /**
   * Set a fixed column group
   */
  setFixedColumn(currentState, colName) {
    return currentState.update('fixedGroup', fixedGroup =>
      fixedGroup.set('column', colName));
  }

  getFixedColumn(currentState) {
    return currentState.get('fixedGroup').get('column');
  }

  // input data sorted by fixedGroup, generates fixedGroup.summaryRows[]
  setupSummaryRows(currentState, data) {
    let fixedColumn = this.getFixedColumn(currentState);
    let lastValue = data.get(0).get(fixedColumn);
    return currentState.update('fixedGroup', fixedGroup =>
      fixedGroup.set('indices', data.reduce((a, v, i) => {
        if(v.get(fixedColumn) === lastValue) return a;
        lastValue = v.get(fixedColumn);
        return a.push(i);
      }, Immutable.List([0]))
    ));
  }

  // FixedGroup is a column where rows of similar values sort togeather and don't speerate
  sortByFixedGroup(currentState, data, sortCol, sortDirection) {
    let groupMap = Immutable.Map();
    data.forEach((row, index) => {
      let fixedColValue = row.get(this.getFixedColumn(currentState));
      groupMap = groupMap.set(fixedColValue, groupMap.has(fixedColValue)
        ? groupMap.get(fixedColValue).push(index) : Immutable.List([index]));
    });
    return groupMap.map(indexMap => this.sortIndexMap(indexMap, data, sortCol, sortDirection))
      .reduce((a, v) => a.concat(v), Immutable.List());
  }

  /**
   * Sort table by column
   */
  buildIndexMap(currentState, data) {
    return currentState.update('indexMap', () =>
      Immutable.List().setSize(data.size)
      .map((x, i) => i));
  }

  updateSortCol(currentState, nextSortCol) {
    let nextState = currentState.update('sortDirection', sortDir =>
      nextSortCol == currentState.get('sortCol')
      ? locAct.SORT_ASC == sortDir
        ? locAct.SORT_DESC : locAct.SORT_ASC : locAct.SORT_ASC);
    return nextState.update('sortCol', () => nextSortCol);
  }

  sortDataByCol(currentState, data) {
    let sortCol = currentState.get('sortCol');
    let sortDirection = currentState.get('sortDirection') == locAct.SORT_ASC;
    currentState = currentState.update('indexMap', indexMap => this.getFixedColumn(currentState)
    ? this.sortByFixedGroup(currentState, data, sortCol, sortDirection)
    : this.sortIndexMap(indexMap, data, sortCol, sortDirection));
    return currentState;
  }

  sortIndexMap(indexMap, data, sortCol, sortDirection) {
    return indexMap.sort((xIndex, yIndex) => {
      let xValue = data.getIn([xIndex, sortCol]);
      let yValue = data.getIn([yIndex, sortCol]);
      return xValue > yValue
        ? sortDirection ? 1 : -1
        : sortDirection ? -1 : 1;
    });
  }

  /**
   * Filter table by column
   */
  updateFilterBy(currentState, data, id, filter) {
    return this.filterIndexMap(
      currentState.update('filterBy', filterBy =>
        filterBy.set(id, filter)), data);
  }

  // Enhancement: change filter algo based on adding or removing chars
  filterIndexMap(currentState, data) {
    let nextState = this.buildIndexMap(currentState, data);
    let filterBy = nextState.get('filterBy');
    return nextState.update('indexMap', indexMap => {
      filterBy.forEach((v, k) => {
        let searchString = v.toString().toLowerCase();
        indexMap = indexMap.filter(e =>
          data.getIn([e, k]).toString()
          .toLowerCase()
          .indexOf(searchString) !== -1);
      });
      return indexMap;
    });
  }

  enableFiltering(currentState) {
    return currentState.set('filterEnabled', true);
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

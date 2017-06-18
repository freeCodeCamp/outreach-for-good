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
  groupColumn   : Immutable.Map({
    fixedColumn      : '',
    displayColumn    : '',
    aggregateColumns : [],
    indices          : Immutable.List(),
    collapsed        : Immutable.List(),
    // In unaltered data, which index does each group start
    groups           : Immutable.Map(/*{
      absences : Immutable.Map({'School A': 100, ...})
    }*/)
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
  setGroupColumn(currentState, colName) {
    return currentState.update('groupColumn', groupColumn =>
      groupColumn.set('fixedColumn', colName));
  }

  getGroupColumn(currentState) {
    return currentState.get('groupColumn').get('fixedColumn');
  }

  setGroupDisplayColumns(currentState, displayColumn, aggregateColumns) {
    return currentState.update('groupColumn', groupColumn =>
      groupColumn.merge({
        displayColumn,
        aggregateColumns : Immutable.List(aggregateColumns)
      }));
  }

  // input data sorted by groupColumn, generates groupColumn.summaryRows[]
  setupGroupIndices(currentState, data) {
    let groupColumn = this.getGroupColumn(currentState);
    let previousValue = data.get(0).get(groupColumn);
    return currentState.update('groupColumn', nextGroupColumn =>
      nextGroupColumn.set('indices', data.reduce((a, row, i) => {
        if(row.get(groupColumn) === previousValue) return a;
        previousValue = row.get(groupColumn);
        return a.push(i);
      }, Immutable.List([0]))
    ));
  }

  getCorrectedGroupIndices(currentState) {
    return currentState.get('groupColumn').get('indices').map((v, i) => v + i);
  }

  // input data sorted by groupColumn, generates groupColumn.summaryRows[]
  addGroupRowsToIndexMap(currentState) {
    let nextIndexMap = currentState.get('indexMap');
    currentState.get('groupColumn').get('indices')
      .forEach((v, k) => {
        nextIndexMap = nextIndexMap.splice(v + k, 0, nextIndexMap.size);
      });
    return currentState.update('indexMap', () => nextIndexMap);
  }

  // input data sorted by groupColumn, generates groupColumn.summaryRows[]
  setupGroupCollapseRows(currentState, data) {
    let groupColumn = this.getGroupColumn(currentState);
    let groupRowIndices = currentState.get('groupColumn').get('indices').toMap().flip();
    let count = -1;
    return currentState.update('groupColumn', nextGroupColumn =>
      nextGroupColumn.update('groups', () =>
        groupRowIndices.reduce((a, i, indice) => {
          count += 1;
          let rowIndex = indice + count;
          let nextIndice = groupRowIndices.findEntry((v, k) => k > indice);
          let recordCount = nextIndice ? nextIndice[0] - indice : data.size - indice;
          return a.set(rowIndex, Immutable.Map({
            groupColumn : Immutable.Map({
              group : data.get(indice + 1).get(groupColumn),
              count : recordCount
            })
          }).concat(this.getRowAggregateRecord(currentState, data.slice(rowIndex - count, rowIndex + recordCount))));
        }, Immutable.Map()))
    );
  }

  // input data sorted by groupColumn, generates groupColumn.summaryRows[]
  getRowAggregateRecord(currentState, data) {
    let aggregateColumns = currentState.get('groupColumn').get('aggregateColumns').toMap().flip().map(() => 0);
    return data.reduce((a, row) => a.map((v, k) => row.get(k) + v), aggregateColumns);
  }

  // groupColumn is a column where rows of similar values sort togeather and don't speerate
  sortBygroupColumn(currentState, data, sortCol, sortDirection) {
    let groupMap = Immutable.Map();
    data.forEach((row, index) => {
      let fixedColValue = row.get(this.getGroupColumn(currentState));
      groupMap = groupMap.set(fixedColValue, groupMap.has(fixedColValue)
        ? groupMap.get(fixedColValue).push(index) : Immutable.List([index]));
    });
    return groupMap.map(indexMap => this.sortIndexMap(indexMap, data, sortCol, sortDirection))
      .reduce((a, v) => a.concat(v), Immutable.List());
  }

  setCollapsedRow(currentState, mappedIndex) {
    const target = currentState.get('groupColumn').get('collapsed').indexOf(mappedIndex);
    if(target == -1) {
      return currentState.update('groupColumn', nextGroupColumn =>
        nextGroupColumn.update('collapsed', i => i.push(mappedIndex)));
    } else {
      return currentState.update('groupColumn', nextGroupColumn =>
        nextGroupColumn.update('collapsed', i => i.splice(target, 1)));
    }
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
    currentState = currentState.update('indexMap', indexMap => this.getGroupColumn(currentState)
    ? this.sortBygroupColumn(currentState, data, sortCol, sortDirection)
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
    if(target == -1) { // target was not selected
      let index = currentState.get('indexMap').get(mappedIndex);
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

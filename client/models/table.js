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
  indexMap_uf   : Immutable.List(), // unfiltered index map
  sortDirection : locAct.SORT_ASC,
  sortCol       : '',
  filterEnabled : false,
  // filterBy: {data_id: filter_value, ...}
  filterBy      : Immutable.Map(),
  // inspect `groupCol.toJS()` in data-table.js to review the groupColumn data structure
  groupColumn   : Immutable.Map({
    fixedColumn      : '', // col which data is grouped by
    displayColumn    : '', // used for Summary Row (ex. School A (12))
    aggregateColumns : Immutable.List(), // columns to sum() for Summary Row
    aggregateType    : 'sum', // average, sum, maximum, minimum
    groupIndices     : Immutable.List(), // first index of each group
    collapsed        : Immutable.List(), // index of groupIndicies which are collapsed/expanded (data + 1, 2..)
    summaryRows      : Immutable.Map(/*{ //group summary (mainly sum() of columns)
      [_indexMap-position]: { // starts at 0, indicates where to insert in _data
        groupColumn: {count: ##, group: "School XX"},
        entry.enrolled: ##,
        entry...
      }
    }*/)
  }),
  // used to display MaterialUI Components
  MuiPopovers : Immutable.Map(),
  MuiDialogs  : Immutable.Map(),
  MuiAnchor   : null,
});

class TableModel extends Table {

  setSelectedTab(state, name) {
    return state.set('selectedTab', name);
  }

  /**
   * Column Groups
   *  - Rows are sorted/filtered only within their designated group (or fixedColumn)
   *  - 'school.name' is the fixedColumn in the context of this app
   *  - fixedColumn includes a sumamry row and can be expanded/collapsed
   *  - right-most column of the table should the same id as `fixedColumn` to add
   *    an expansion indicator ( + ) column
   */
  setFixedColumn(state, colName, summaryColumn) {
    let nextState = summaryColumn // optional shorthand, set both in one call
      ? this.setGroupSummaryColumn(state, summaryColumn)
      : state;
    return nextState.update('groupColumn', groupColumn =>
      groupColumn.set('fixedColumn', colName));
  }

  getFixedColumn(state) {
    return state.getIn(['groupColumn', 'fixedColumn'], null);
  }

  // displayColumn: col where fixedGroup name and count are displayed, ex. School A (10)
  setGroupSummaryColumn(state, displayColumn) {
    return state.update('groupColumn', groupColumn =>
      groupColumn.set('displayColumn', displayColumn));
  }

  // aggregateColumns: cols that are added togeather to generate totals for sumamry row
  setGroupAggregateColumns(state, aggregateColumns) {
    return state.update('groupColumn', groupColumn =>
      groupColumn.set('aggregateColumns', Immutable.List(aggregateColumns)));
  }

  // Shorthand for tasks required to setup dataTable for fixed column groups
  setupFixedGroups(state, data) {
    let nextState = this.setupGroupIndices(state, data);
    nextState = this.addGroupRowsToIndexMap(nextState, data.size);
    return this.setupGroupSummaryRows(nextState, data);
  }

  // Shorthand for tasks required to setup dataTable for fixed column groups
  collapseFixedGroups(state) {
    return state.updateIn(['groupColumn', 'collapsed'], () =>
      state.getIn(['groupColumn', 'groupIndices']).map((v, i) =>
        state.getIn(['indexMap_uf']).size - i - 1));
  }

  // Generate groupColumn.indices
  //  - List() of indices where each new Group begins
  //  - Not corrected for the extra data.length caused by Summary Row insertions
  setupGroupIndices(state, data) {
    let groupColumn = state.get('groupColumn').get('fixedColumn');
    let previousValue = data.getIn([0, groupColumn]);
    return state.update('groupColumn', nextGroupColumn =>
      nextGroupColumn.set('groupIndices', data.reduce((a, row, i) => {
        if(row.get(groupColumn) === previousValue) return a;
        previousValue = row.get(groupColumn);
        return a.push(i);
      }, Immutable.List([0]))
    ));
  }

  // Convert index # in data where each new group begins (groupColumns.groupIndices[])
  //   to the index # in _data where each Summary Row is
  getCorrectedGroupIndices(state) {
    return state.getIn(['groupColumn', 'groupIndices']).map((v, i) => v + i);
  }

  // Insert groupColumn Sumamry Row index locations into indexMap
  //  - value = indexMap.size because Summary Rows will be pushed to the end of the data
  //  - must account for indices increasing the indexMap size with each insertion
  addGroupRowsToIndexMap(state, dataSize) {
    return state.update('indexMap', indexMap =>
      state.get('groupColumn').get('groupIndices').reduce((_indexMap, indice, i) =>
        _indexMap.splice(indice + i, 0, dataSize + i), indexMap));
  }

  // Generate counts and display data for each Summary Row
  //  - needs to be refactored
  setupGroupSummaryRows(state, data) {
    let groupColumn = this.getFixedColumn(state);
    let groupRowIndices = state.get('groupColumn').get('groupIndices').toMap().flip();
    let count = -1;
    return state.updateIn(['groupColumn', 'summaryRows'], () =>
      groupRowIndices.sort().reduce((a, i, indice) => {
        count += 1;
        let rowIndex = indice + count;
        let nextIndice = groupRowIndices.sort().findEntry((v, k) => k > indice);
        let recordCount = nextIndice ? nextIndice[0] - indice : data.size - indice;
        return a.set(rowIndex, Immutable.Map({
          groupColumn : Immutable.Map({
            group : data.getIn([indice, groupColumn]),
            count : recordCount
          })
        }).concat(this.getRowAggregateRecord(state, data.slice(rowIndex - count, rowIndex + recordCount - count))));
      }, Immutable.Map()));
  }

  // input data sorted by groupColumn, generates groupColumn.summaryRows[]
  getRowAggregateRecord(state, data) {
    let aggregateColumns = state.getIn(['groupColumn', 'aggregateColumns']).toMap().flip().map(() => 0);
    switch (state.getIn(['groupColumn', 'aggregateType'])) {
    case 'sum': return data.reduce((summaryRow, dataRow) =>
      summaryRow.map((currentSum, dataKey) =>
        dataRow.get(dataKey, 0) + currentSum)
      , aggregateColumns);
    case 'average': let count = -1;
      return data.reduce((summaryRow, dataRow) => {
        count++;
        return summaryRow.map((currentSum, dataKey) =>
          (dataRow.get(dataKey) + currentSum * (count || 1)) / (count + 1));
      }, aggregateColumns).map(value => Math.round(value * 10) / 10);
    case 'maximum': return data.reduce((summaryRow, dataRow) =>
      summaryRow.map((currentMax, dataKey) =>
        dataRow.get(dataKey) > currentMax ? dataRow.get(dataKey) : currentMax)
      , aggregateColumns);
    case 'minimum': return data.reduce((summaryRow, dataRow) =>
      summaryRow.map((currentMin, dataKey) =>
        currentMin === 0 ? dataRow.get(dataKey)
          : dataRow.get(dataKey) < currentMin ? dataRow.get(dataKey) : currentMin)
      , aggregateColumns);
    }
  }


  changeAggregateType(state, type) {
    return state.updateIn(['groupColumn', 'aggregateType'], () => type);
  }

  // Adds/removes row index from a List() of collapsed rows
  // Collapses the group with summary row in collapsed[] index position
  toggleCollapsedRow(state, mappedIndex) {
    const target = state.getIn(['groupColumn', 'collapsed']).indexOf(mappedIndex);
    return target == -1
      ? state.updateIn(['groupColumn', 'collapsed'], i => i.push(mappedIndex))
      : state.updateIn(['groupColumn', 'collapsed'], i => i.splice(target, 1));
  }

  // DataTable Inline Function
  //  - remove collapsed indices from indexMap before rendering
  //  - indexMap (obviously) needs to contain summary rows to collapse
  //  - return: indexMap
  // For performance, we assume groupColumn-collapsed appear in-order in indexMap
  removeCollapsedDataFromIndexMap(state, dataSize) {
    let nextIndexMap = Immutable.List();
    let collapsed = state.getIn(['groupColumn', 'collapsed']).sort();
    let summaryRows = state.getIn(['groupColumn', 'summaryRows']).sortBy((v, k) => k);
    let unfilteredIndexMap = state.get('indexMap_uf');
    let currentCollapsedIndex = dataSize - summaryRows.size;
    summaryRows.forEach((v, k) => {
      if(collapsed.indexOf(currentCollapsedIndex) >= 0) {
        nextIndexMap = nextIndexMap.push(currentCollapsedIndex);
      } else {
        let nextGroup = unfilteredIndexMap.slice(k, k + v.getIn(['groupColumn', 'count']) + 1);
        nextIndexMap = nextIndexMap.concat(nextGroup);
      }
      currentCollapsedIndex += 1;
    });
    return nextIndexMap;
  }

  // groupColumn is a column where rows of similar values sort togeather and don't speerate
  sortByGroupColumn(state, data, sortCol, sortDirection) {
    let groupMap = Immutable.Map();
    data.forEach((row, index) => {
      let fixedColValue = row.get(this.getFixedColumn(state));
      groupMap = groupMap.set(fixedColValue, groupMap.has(fixedColValue)
        ? groupMap.get(fixedColValue).push(index) : Immutable.List([index]));
    });
    return groupMap.map(indexMap => this.sortIndexMap(indexMap, data, sortCol, sortDirection))
      .reduce((a, v) => a.concat(v), Immutable.List());
  }

  /**
   * Sort table by column
   */
  buildIndexMap(state, data) {
    let nextState = state.update('indexMap', () =>
      Immutable.List().setSize(data.size)
      .map((x, i) => i));
    nextState = this.sortDataByCol(nextState, data);
    if(this.getFixedColumn(nextState)) {
      nextState = nextState.setupFixedGroups(nextState, data);
    }
    return nextState.set('indexMap_uf', nextState.get('indexMap'));
  }

  updateSortCol(state, nextSortCol) {
    let nextState = state.update('sortDirection', sortDir =>
      nextSortCol == state.get('sortCol')
      ? locAct.SORT_ASC == sortDir
        ? locAct.SORT_DESC : locAct.SORT_ASC : locAct.SORT_ASC);
    return nextState.update('sortCol', () => nextSortCol);
  }

  // Sort index map, accounts for fixedColumn if set
  sortDataByCol(state, data) {
    let sortCol = state.get('sortCol');
    let sortDirection = state.get('sortDirection') == locAct.SORT_ASC;
    state = state.update('indexMap', indexMap => this.getFixedColumn(state)
    ? this.sortByGroupColumn(state, data, sortCol, sortDirection)
    : this.sortIndexMap(indexMap, data, sortCol, sortDirection));
    return state;
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
  updateFilterBy(state, colId, filter) {
    return state.update('filterBy', filterBy =>
      filterBy.set(colId, filter));
  }

  // Enhancement: change filter algo based on adding or removing chars
  // Enhancement: use intelligent map instead of indexOf
  filterIndexMap(state, data) {
    let nextState = this.buildIndexMap(state, data);
    let filterBy = nextState.get('filterBy');
    return nextState.update('indexMap', indexMap => {
      filterBy.forEach((v, k) => {
        let searchString = v.toString().toLowerCase();
        indexMap = indexMap.filter(e =>
          e < data.size // If using groupColumn
          && data.getIn([e, k]).toString()
          .toLowerCase()
          .indexOf(searchString) !== -1);
      });
      return nextState.get('indexMap_uf').filter(i => indexMap.indexOf(i) !== -1 || data.size <= i);
    });
  }

  enableFiltering(state) {
    return state.set('filterEnabled', true);
  }

  /**
   * Row Select and Highlighting
   */
  toggleSelectedRowIndex(state, dataIndex) {
    let target = state.get('selectedIndex').indexOf(dataIndex);
    if(target == -1) { // target was not selected
      //let index = state.get('indexMap').get(dataIndex);
      return state.update('selectedIndex', i => i.push(dataIndex));
    } else {
      return state.update('selectedIndex', i => i.splice(target, 1));
    }
  }

  // Only allow one row to be selected
  toggleSingleSelectedRowIndex(state, dataIndex) {
    let target = state.get('selectedIndex').indexOf(dataIndex);
    if(target == -1) { // target was not selected
      //let index = state.get('indexMap').get(dataIndex);
      return state.update('selectedIndex', i => i.clear().push(dataIndex));
    } else {
      return state.update('selectedIndex', i => i.clear());
    }
  }

  // Returns `selectedIndex` mapped to table sort order
  selectionToMappedIndicies(state, _indexMap) {
    let indexMap = _indexMap || state.get('indexMap');
    return state
      .get('selectedIndex').map(index =>
        indexMap.indexOf(index));
  }

  clearSelectedRows(state) {
    return state.update('selectedIndex', i => i.clear());
  }

  // Return data stored in selected rows
  setSelectedRowData(state, data) {
    return state.update('selectedData', i => i.clear().merge(data));
  }

  // Return string of comma seperated cell values (from selection)
  selectedRowsToCsv(state, column) {
    return state.get('selectedData')
      .map(row => row[column])
      .join(', ');
  }

  /**
   * Action Handlers
   */
  handlePopoverButtonClick(nextTable, data, event) {
    nextTable = this.togglePopovers(nextTable, data);
    nextTable = this.setAnchor(nextTable, event.currentTarget);
    return this.resetDialogs(nextTable);
  }

  /**
   * Material-UI <Popover>
   */
  addPopovers(state, popoverValues) {
    return state.update('MuiPopovers', i => i.clear().merge(popoverValues));
  }

  togglePopovers(state, popoverValue) {
    return state.update('MuiPopovers', iMap =>
      iMap.update(popoverValue, currentState => !currentState));
  }

  resetPopovers(state) {
    return state.update('MuiPopovers', iMap => iMap.map(() => false));
  }

  // Set anchor element for <Popover> menu
  setAnchor(state, anchor) {
    return state.set('MuiAnchor', anchor);
  }

  /**
   * Material-UI <Dialog>
   */
  addDialogs(state, dialogValues) {
    return state.update('MuiDialogs', i => i.clear().merge(dialogValues));
  }

  toggleDialogs(state, dialogValue) {
    return state.update('MuiDialogs', iMap =>
      iMap.update(dialogValue, currentState => !currentState));
  }

  resetDialogs(state) {
    return state.update('MuiDialogs', iMap => iMap.map(() => false));
  }
}

export default TableModel;

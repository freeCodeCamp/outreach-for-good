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
  // filterBy: {data_id: filter_value, ...}
  filterBy      : Immutable.Map(),
  groupColumn   : Immutable.Map({
    fixedColumn      : '', // col which data is grouped by
    displayColumn    : '', // used for Summary Row
    aggregateColumns : Immutable.List(), // columns to sum() for Summary Row
    groupIndices     : Immutable.List(), // first index of each group
    collapsed        : Immutable.List(), // groups which are collapsed/expanded
    summaryRows      : Immutable.Map(/*{
      [corrected-index-##]: {
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
    return state.get('groupColumn').get('fixedColumn');
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
    nextState = this.addGroupRowsToIndexMap(nextState);
    return this.setupGroupSummaryRows(nextState, data);
  }

  // Generate groupColumn.indices
  //  - List() of indices where each new Group begins
  //  - Not corrected for the extra data.length caused by Summary Row insertions
  setupGroupIndices(state, data) {
    let groupColumn = state.get('groupColumn').get('fixedColumn');
    let previousValue = data.get(0).get(groupColumn);
    return state.update('groupColumn', nextGroupColumn =>
      nextGroupColumn.set('groupIndices', data.reduce((a, row, i) => {
        if(row.get(groupColumn) === previousValue) return a;
        previousValue = row.get(groupColumn);
        return a.push(i);
      }, Immutable.List([0]))
    ));
  }

  // Indices where Summary Rows go, accounting for # of previous rows inserted
  getCorrectedGroupIndices(state) {
    return state.get('groupColumn').get('groupIndices').map((v, i) => v + i);
  }

  // Insert groupColumn Sumamry Row index locations into indexMap
  //  - value = indexMap.size because Summary Rows will be pushed to the end of the data
  //  - must account for indices increasing the indexMap size with each insertion
  addGroupRowsToIndexMap(state) {
    return state.update('indexMap', indexMap =>
      state.get('groupColumn').get('groupIndices').reduce((_indexMap, indice, i) =>
        _indexMap.splice(indice + i, 0, _indexMap.size), indexMap));
  }

  // Generate counts and display data for each Summary Row
  //  - needs to be refactored
  setupGroupSummaryRows(state, data) {
    let groupColumn = this.getFixedColumn(state);
    let groupRowIndices = state.get('groupColumn').get('groupIndices').toMap().flip();
    let count = -1;
    return state.update('groupColumn', nextGroupColumn =>
      nextGroupColumn.update('summaryRows', () =>
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
          }).concat(this.getRowAggregateRecord(state, data.slice(rowIndex - count, rowIndex + recordCount))));
        }, Immutable.Map()))
    );
  }

  // input data sorted by groupColumn, generates groupColumn.summaryRows[]
  getRowAggregateRecord(state, data) {
    let aggregateColumns = state.get('groupColumn').get('aggregateColumns').toMap().flip().map(() => 0);
    return data.reduce((a, row) => a.map((v, k) => row.get(k) + v), aggregateColumns);
  }

  // groupColumn is a column where rows of similar values sort togeather and don't speerate
  sortBygroupColumn(state, data, sortCol, sortDirection) {
    let groupMap = Immutable.Map();
    data.forEach((row, index) => {
      let fixedColValue = row.get(this.getFixedColumn(state));
      groupMap = groupMap.set(fixedColValue, groupMap.has(fixedColValue)
        ? groupMap.get(fixedColValue).push(index) : Immutable.List([index]));
    });
    return groupMap.map(indexMap => this.sortIndexMap(indexMap, data, sortCol, sortDirection))
      .reduce((a, v) => a.concat(v), Immutable.List());
  }

  setCollapsedRow(state, mappedIndex) {
    const target = state.get('groupColumn').get('collapsed').indexOf(mappedIndex);
    if(target == -1) {
      return state.update('groupColumn', nextGroupColumn =>
        nextGroupColumn.update('collapsed', i => i.push(mappedIndex)));
    } else {
      return state.update('groupColumn', nextGroupColumn =>
        nextGroupColumn.update('collapsed', i => i.splice(target, 1)));
    }
  }

  /**
   * Sort table by column
   */
  buildIndexMap(state, data) {
    return state.update('indexMap', () =>
      Immutable.List().setSize(data.size)
      .map((x, i) => i));
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
    ? this.sortBygroupColumn(state, data, sortCol, sortDirection)
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
  updateFilterBy(state, data, id, filter) {
    return this.filterIndexMap(
      state.update('filterBy', filterBy =>
        filterBy.set(id, filter)), data);
  }

  // Enhancement: change filter algo based on adding or removing chars
  filterIndexMap(state, data) {
    let nextState = this.buildIndexMap(state, data);
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

  enableFiltering(state) {
    return state.set('filterEnabled', true);
  }

  /**
   * Row Select and Highlighting
   */
  toggleSelectedRowIndex(state, mappedIndex) {
    let target = this.selectionToMappedIndicies(state).indexOf(mappedIndex);
    if(target == -1) { // target was not selected
      let index = state.get('indexMap').get(mappedIndex);
      return state.update('selectedIndex', i => i.push(index));
    } else {
      return state.update('selectedIndex', i => i.splice(target, 1));
    }
  }

  // Returns `selectedIndex` mapped to table sort order
  selectionToMappedIndicies(state) {
    let indexMap = state.get('indexMap');
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

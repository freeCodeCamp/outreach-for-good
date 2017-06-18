import React from 'react';
import PropTypes from 'prop-types';

import { Table, Column, Cell } from 'fixed-data-table-2';
import { List } from 'immutable';

import DataTableHeader from './data-table-header';
import DataTableRow from './data-table-row';
import TableModel from '../../models/table';
import './data-table.scss';
import './data-table-override.scss';

class TableContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    //console.log(nextProps.table.get('indexMap'), nextProps.data);
    return this.props.data !== nextProps.data
      || this.props.loaded !== nextProps.loaded
      || this.props.view.width !== nextProps.view.width
      || this.props.view.height !== nextProps.view.height
      || this.props.table.get('indexMap') !== nextProps.table.get('indexMap')
      || this.props.table.get('selectedIndex') !== nextProps.table.get('selectedIndex')
      || this.props.table.get('sortCol') !== nextProps.table.get('sortCol')
      || this.props.table.get('sortDirection') !== nextProps.table.get('sortDirection')
      || this.props.table.get('groupColumn') !== nextProps.table.get('groupColumn');
  }

  /**
   * DataTable Handler
   *   - Catch events from the table and send to parent component
   */

  isRowSelected = index =>
    this.props.table.selectionToMappedIndicies(this.props.table).includes(index)
    ? 'selected-row' : '';

  rowToggleSelected = (event, index) => {
    this.props.clickHandler('toggleSelected', index);
  }

  tableSortHandler = event => {
    this.props.clickHandler('toggleSortCol', event.target.id);
  }

  tableFilterHandler = event => {
    this.props.clickHandler('changeFilterCol', event.target.id, event.target.value);
  }

  render() {
    const {
      data,
      loaded,
      page,
      table,
      view
    } = this.props;
    const groupCol = table.get('groupColumn');
    const fixedColumn = table.getFixedColumn(table);

    let _data = data;
    let _indexMap = table.get('indexMap');
    if(fixedColumn) {
      const displayColumn = groupCol.get('displayColumn');
      const summaryRows = groupCol.get('summaryRows');
      const groupIndices = groupCol.get('groupIndices');
      let count = -1;
      groupIndices.forEach(i => {
        count += 1;
        _data = _data.push(_data.get(0).map((v, k) => {
          if(k === displayColumn) {
            return `${summaryRows.get(i + count).get('groupColumn').get('group')}
              (${summaryRows.get(i + count).get('groupColumn').get('count')})`;
          } else if(summaryRows.get(i + count).get(k) !== null) {
            return summaryRows.get(i + count).get(k);
          }
          return '';
        }));
      });
      _indexMap = table.removeCollapsedDataFromIndexMap(table, _data.size);
    }

    return (
      <Table
        rowHeight={table.get('rowHeight') || 30}
        headerHeight={table.get('filterEnabled')
          ? table.get('filterHeaderHeight') || 60
          : table.get('headerHeight') || 30}
        rowsCount={loaded ? _indexMap.size : 1}
        width={view.width || 100}
        maxHeight={view.height}
        onRowClick={this.rowToggleSelected}
        rowClassNameGetter={this.isRowSelected}
        id="theDataTable"
      >
      {/*console.log('Debugging race condition: ', data, page.columns)*/}
      {page.columns && page.columns
        .map(col =>
        <Column
          header={
            <DataTableHeader
              filter={table.get('filterEnabled')}
              filterHandler={this.tableFilterHandler}
              id={col.id}
              sortCol={table.get('sortCol')}
              sortDir={table.get('sortDirection')}
              sortHandler={this.tableSortHandler}
              title={col.title}
            />
            }
          cell={
            loaded
            ? <DataTableRow
              indexMap={_indexMap}
              data={_data}
              col={col.id}
              fixedColumn={fixedColumn}
            />
            : <Cell className="cell-loading">
                <i className="fa fa-refresh fa-spin" />
              </Cell>
            }
          fixed={col.fixed}
          flexGrow={col.flexGrow}
          key={col.id}
          width={col.width || 200}
        />
        )}
        {/*console.log('Debugging race condition: ', data.toJS())*/}
      </Table>
    );
  }
}

TableContainer.propTypes = {
  clickHandler : PropTypes.func.isRequired,
  data         : PropTypes.instanceOf(List).isRequired,
  page         : PropTypes.object.isRequired,
  loaded       : PropTypes.bool,
  selectedRows : PropTypes.object,
  table        : PropTypes.instanceOf(TableModel).isRequired,
  view         : PropTypes.object.isRequired
};

export default TableContainer;

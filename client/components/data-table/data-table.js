import React from 'react';
import PropTypes from 'prop-types';

import { Table, Column, Cell } from 'fixed-data-table-2';
import { List } from 'immutable';

import DataTableHeader from './data-table-header';
import { insertSummaryRows } from './data-table.utility';
import DataTableRow from './data-table-row';
import TableModel from '../../models/table';
import './data-table.scss';
import './data-table-override.scss';

class DataTable extends React.Component {
  shouldComponentUpdate(nextProps) {
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

  fixedColumn = null;
  _data = List();
  _indexMap = List();


  /**
   * DataTable Handler
   *   - Catch events from the table and send to parent component
   */

  rowToggleSelected = (event, index) => {
    // references the index of unsorted `data`
    this.props.clickHandler('toggleSelected', this._indexMap.get(index));
  }

  tableSortHandler = event => {
    this.props.clickHandler('toggleSortCol', event.target.id);
  }

  tableFilterHandler = event => {
    this.props.clickHandler('changeFilterCol', event.target.id, event.target.value);
  }

  getFixedColumn = () =>
    this.props.table.getFixedColumn(this.props.table);

  render() {
    const {
      data,
      loaded,
      page,
      table,
      view
    } = this.props;

    // Uncomment to debug groupCol data structure
    console.log('data: ', table.get('groupColumn').toJS());

    var { _data, _indexMap } = insertSummaryRows(data, table);
    this._data = _data;
    this._indexMap = _indexMap;

    let isRowSelected = index =>
      table.selectionToMappedIndicies(table, this._indexMap).includes(index) ? 'selected-row' : '';

    return (
      <Table
        rowHeight={table.get('rowHeight') || 30}
        headerHeight={table.get('filterEnabled')
          ? table.get('filterHeaderHeight') || 60
          : table.get('headerHeight') || 30}
        rowsCount={loaded ? this._indexMap && this._indexMap.size : 1}
        width={view.width || 100}
        maxHeight={view.height}
        onRowClick={this.rowToggleSelected}
        rowClassNameGetter={isRowSelected}
        id="theDataTable"
      >
      {/* {console.log('Debugging: ', this._indexMap.toJS(), table.get('indexMap').toJS())} */}
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
              indexMap={this._indexMap}
              data={this._data}
              col={col.id}
              type={col.type}
              fixedColumn={this.getFixedColumn()}
              collapsedColumns={table.getIn(['groupColumn', 'collapsed'])}
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
      </Table>
    );
  }
}

DataTable.propTypes = {
  clickHandler : PropTypes.func.isRequired,
  data         : PropTypes.instanceOf(List).isRequired,
  page         : PropTypes.object.isRequired,
  loaded       : PropTypes.bool,
  selectedRows : PropTypes.object,
  table        : PropTypes.instanceOf(TableModel).isRequired,
  view         : PropTypes.object.isRequired
};

export default DataTable;

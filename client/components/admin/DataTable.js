import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import DataTableRow from './DataTableRow';

const DataTable = ({table, column, data}) =>
  <Table
    rowHeight={table.rowHeight || 40}
    headerHeight={table.headerHeight || 40}
    rowsCount={data.length}
    width={table.table.width}
    height={table.table.height}
  >
  {column.map(col =>
    <Column
      header={<Cell>{col.title}</Cell>}
      cell={<DataTableRow data={data} col={col.id} />}
      fixed={col.fixed}
      flexGrow={col.flexGrow}
      key={col.id}
      width={col.width || 200}
    />
    )}
  </Table>
;

DataTable.propTypes = {
  table  : PropTypes.object.isRequired,
  column : PropTypes.array.isRequired,
  data   : PropTypes.array.isRequired
};

export default DataTable;

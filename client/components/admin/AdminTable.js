import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import AdminTableRow from './AdminTableRow';

const AdminTable = ({data, width, height}) =>
  <Table
    rowHeight={50}
    headerHeight={50}
    rowsCount={data.length}
    width={width}
    height={height}
  >
    <Column
      header={<Cell>Name</Cell>}
      cell={<AdminTableRow data={data} col="name" />}
      fixed
      width={100}
    />
    <Column
      header={<Cell>email</Cell>}
      cell={<AdminTableRow data={data} col="email" />}
      flexGrow={2}
      width={200}
    />
  </Table>
  ;

AdminTable.propTypes = {
  data   : PropTypes.array.isRequired,
  width  : PropTypes.number.isRequired,
  height : PropTypes.number.isRequired,
};

export default AdminTable;

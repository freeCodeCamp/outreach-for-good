import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const SimpleTable = ({ columns, data, selectable = false, onRowSelect }) =>
  <Table
    selectable={selectable}
    onRowSelection={onRowSelect}
  >
    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
      <TableRow>
        {columns.map((column, i) => <TableHeaderColumn key={i}>{column}</TableHeaderColumn>)}
      </TableRow>
    </TableHeader>
    <TableBody
      deselectOnClickaway={false}
      displayRowCheckbox={false}>
      {data.map((row, i) =>
        <TableRow key={i} style={{padding: '0'}}>
          {row.map((cell, j) => <TableRowColumn key={j}>{cell}</TableRowColumn>)}
        </TableRow>
      )}
    </TableBody>
  </Table>;

SimpleTable.propTypes = {
  columns : PropTypes.array,
  data    : PropTypes.array
};

export default SimpleTable;

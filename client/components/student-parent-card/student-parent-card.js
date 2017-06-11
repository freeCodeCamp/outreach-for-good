import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const parentData = [
  {
    name  : 'Mom',
    date  : new Date(),
    hours : 3
  }, {
    name  : 'Mom',
    date  : new Date(),
    hours : 3
  }, {
    name  : 'Mom',
    date  : new Date(),
    hours : 3
  }, {
    name  : 'Mom',
    date  : new Date(),
    hours : 3
  }, {
    name  : 'Mom',
    date  : new Date(),
    hours : 3
  }, {
    name  : 'Mom',
    date  : new Date(),
    hours : 3
  }
];
const Parent = () =>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>Date</TableHeaderColumn>
        <TableHeaderColumn>Parent Name</TableHeaderColumn>
        <TableHeaderColumn>Hours Volunteered</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {parentData.map((parent, i) =>
        <TableRow key={i}>
          <TableRowColumn>{parent.date.toDateString()}</TableRowColumn>
          <TableRowColumn>{parent.name}</TableRowColumn>
          <TableRowColumn>{parent.hours}</TableRowColumn>
        </TableRow>)}
    </TableBody>
  </Table>
;

export default Parent;

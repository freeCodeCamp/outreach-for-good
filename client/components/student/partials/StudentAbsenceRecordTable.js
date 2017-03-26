import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const StudentAbsenceRecordTable = props =>
  <Table
    height="200px"
    selectable={false}>
    <TableHeader
      displaySelectAll={false}>
      <TableRow
        selectable={false}>
        <TableHeaderColumn tooltip="Date">Date</TableHeaderColumn>
        <TableHeaderColumn tooltip="Present">P</TableHeaderColumn>
        <TableHeaderColumn tooltip="Tardies">T</TableHeaderColumn>
        <TableHeaderColumn tooltip="Tardies Delta">T&Delta;</TableHeaderColumn>
        <TableHeaderColumn tooltip="Absences">A</TableHeaderColumn>
        <TableHeaderColumn tooltip="Absences Delta">A&Delta;</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody
      displayRowCheckbox={false}>
      {props.records.map(record =>
        <TableRow>
          <TableRowColumn>{new Date(record.date).toDateString()}</TableRowColumn>
          <TableRowColumn>{record.entry.present}</TableRowColumn>
          <TableRowColumn>{record.entry.tardies}</TableRowColumn>
          <TableRowColumn>{record.entry.tardiesDelta}</TableRowColumn>
          <TableRowColumn>{record.entry.absences}</TableRowColumn>
          <TableRowColumn>{record.entry.absencesDelta}</TableRowColumn>
        </TableRow>
      )}
    </TableBody>
  </Table>
;

export default StudentAbsenceRecordTable;

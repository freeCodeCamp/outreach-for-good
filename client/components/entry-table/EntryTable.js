import React from 'react';
import PropTypes from 'prop-types';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


const EntryTable = ({ records }) =>
  <Table>
    <TableHeader
      displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>School Year</TableHeaderColumn>
        <TableHeaderColumn>Date</TableHeaderColumn>
        <TableHeaderColumn>Entries</TableHeaderColumn>
        <TableHeaderColumn>Created</TableHeaderColumn>
        <TableHeaderColumn>New Missing</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {records.map((record, i) =>
        <TableRow key={i}>
          <TableRowColumn>{record.schoolYear}</TableRowColumn>
          <TableRowColumn>{record.date}</TableRowColumn>
          <TableRowColumn>{record.createdStudents.length}</TableRowColumn>
          <TableRowColumn>{record.entries.length}</TableRowColumn>
          <TableRowColumn>{record.newMissingStudents.length}</TableRowColumn>
        </TableRow>
      )}
    </TableBody>
  </Table>
;

EntryTable.propTypes = {
  records : PropTypes.array
};

export default EntryTable;

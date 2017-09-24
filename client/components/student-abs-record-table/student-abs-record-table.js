import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from '../../utils/date';

const StudentAbsenceRecordTable = props =>
  <table className="student-record-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>P</th>
        <th>T</th>
        <th>T&Delta;</th>
        <th>A</th>
        <th>&Delta;</th>
      </tr>
    </thead>
    <tbody>
      {props.absenceRecords.map(record =>
      <tr key={record._id}>
        <td>{formatDate(new Date(record.date))}</td>
        <td>{record.entry.present}</td>
        <td>{record.entry.tardies}</td>
        <td>{record.entry.tardiesDelta}</td>
        <td>{record.entry.absences}</td>
        <td>{record.entry.absencesDelta}</td>
      </tr>
      )}
    </tbody>
  </table>;

StudentAbsenceRecordTable.propTypes = {
  absenceRecords : PropTypes.array.isRequired
};

export default StudentAbsenceRecordTable;

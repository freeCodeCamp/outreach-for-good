import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from '../../utils/date';
import './student-abs-record-table.scss';

const StudentAbsenceRecordTable = props =>
  <table className="student-record-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>A</th>
        <th>&Delta;A</th>
        <th>T</th>
        <th>&Delta;T</th>
        <th>P</th>
        <th>E</th>
        <th>P/E %</th>
      </tr>
    </thead>
    <tbody>
      {props.absenceRecords.map(record =>
      <tr key={record._id}>
        <td>{formatDate(new Date(record.date))}</td>
        <td>{record.entry.absences}</td>
        <td>{record.entry.absencesDelta}</td>
        <td>{record.entry.tardies}</td>
        <td>{record.entry.tardiesDelta}</td>
        <td>{record.entry.present}</td>
        <td>{record.entry.enrolled}</td>
        <td>{ +(record.entry.present / record.entry.enrolled * 100).toFixed(1) }</td>
      </tr>
      )}
    </tbody>
  </table>;

StudentAbsenceRecordTable.propTypes = {
  absenceRecords : PropTypes.array.isRequired
};

export default StudentAbsenceRecordTable;

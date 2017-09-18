import React from 'react';
import PropTypes from 'prop-types';

const StudentRecordTable = props =>
<table className="student-record-table">
  <thead>
    <tr>
      <th>_id</th>
      <th>Absences</th>
      <th>Δ Absences</th>
      <th>Tardies</th>
      <th>Δ Tardies</th>
      <th>Present</th>
      <th>Enrolled</th>
    </tr>
  </thead>
  <tbody>
    {props.studentRecords.map(record =>
    <tr key={record._id}>
      <td data-title="Student Id">{record._id}</td>
      <td data-title="Absences">{record.absences}</td>
      <td data-title="Δ Absences">{record.absencesDelta}</td>
      <td data-title="Tardies">{record.tardies}</td>
      <td data-title="Δ Tardies">{record.tardiesDelta}</td>
      <td data-title="Present">{record.present}</td>
      <td data-title="Enrolled">{record.enrolled}</td>
    </tr>
    )}
  </tbody>
</table>;

StudentRecordTable.propTypes = {
  studentRecords : PropTypes.array.isRequired
};

export default StudentRecordTable;

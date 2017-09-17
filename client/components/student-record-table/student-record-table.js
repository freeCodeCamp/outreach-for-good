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
    {props.studentRecords.forEach(record =>
    <tr>
      <td data-title="_id">{record.id}</td>
      <td data-title="Absences">{record.id}</td>
      <td data-title="Δ Absences">{record.id}</td>
      <td data-title="Tardies">{record.id}</td>
      <td data-title="Δ Tardies">{record.id}</td>
      <td data-title="Present">{record.id}</td>
      <td data-title="Enrolled">{record.id}</td>
    </tr>
    )}
  </tbody>
</table>;

StudentRecordTable.propTypes = {
  studentRecords : PropTypes.array.isRequired
};

export default StudentRecordTable;

import React from 'react';
import PropTypes from 'prop-types';

const StudentRecordTable = props => {
  let tableBody = null;
  props.studentRecords.forEach(record => {
    tableBody = tableBody + (<tr>
      <td data-title="Student Id">{record.student && record.student.studentId}</td>
      <td data-title="Absences">{record.absences}</td>
      <td data-title="Δ Absences">{record.absencesDelta}</td>
      <td data-title="Tardies">{record.tardies}</td>
      <td data-title="Δ Tardies">{record.tardiesDelta}</td>
      <td data-title="Present">{record.present}</td>
      <td data-title="Enrolled">{record.enrolled}</td>
    </tr>);
  });
  return (
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
        {tableBody}
      </tbody>
    </table>
  );
}

StudentRecordTable.propTypes = {
  studentRecords : PropTypes.array.isRequired
};

export default StudentRecordTable;
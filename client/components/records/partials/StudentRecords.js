import React from 'react';
import PropTypes from 'prop-types';

const StudentRecords = ({ title, students }) =>
<div className="column">
  <h1>{title}</h1>
  <ul>
    {students.map((entry, i) =>
      <li key={i}>
        {entry}
      </li>)}
  </ul>
</div>;

StudentRecords.propTypes = {
  title    : PropTypes.string,
  students : PropTypes.object
};

export default StudentRecords;

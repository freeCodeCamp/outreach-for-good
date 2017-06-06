import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../common/data-table/DataTable';

const InterventionsTab = ({interventions, ...props}) => {
  const page = {
    title   : 'Interventions',
    columns : [{
      title    : 'School',
      id       : 'school.name',
      flexGrow : 1
    }, {
      title    : 'Last Name',
      id       : 'student.lastName',
      flexGrow : 1
    }, {
      title    : 'First Name',
      id       : 'student.firstName',
      flexGrow : 1
    }, {
      title    : 'Student ID',
      id       : 'student.studentId',
      flexGrow : 1
    }, {
      title : 'Type',
      id    : 'type',
      width : 100
    }]
  };

  return (
    <DataTable
      page={page}
      data={interventions}
      {...props}
    />
  );
};

InterventionsTab.propTypes = {
  view          : PropTypes.object.isRequired,
  interventions : PropTypes.object,
};

export default InterventionsTab;

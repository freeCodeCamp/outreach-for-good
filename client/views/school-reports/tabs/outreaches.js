import React from 'react';
import PropTypes from 'prop-types';

import DataTable from '../../../components/data-table/data-table';

const OutreachesTab = ({outreaches, ...props}) => {
  const page = {
    title   : 'Outreaches',
    columns : [{
      title    : 'Last Name',
      id       : 'student.lastName',
      width    : 125,
      flexGrow : 1,
      fixed    : true
    }, {
      title    : 'First Name',
      id       : 'student.firstName',
      width    : 125,
      flexGrow : 1
    }, {
      title    : 'School',
      id       : 'school.name',
      width    : 125,
      flexGrow : 1
    }, {
      title    : 'Student ID',
      id       : 'student.studentId',
      width    : 90,
      flexGrow : 1
    }, {
      title    : 'IEP',
      id       : 'student.iep',
      width    : 50,
      flexGrow : 1
    }, {
      title    : 'CFA',
      id       : 'student.cfa',
      width    : 50,
      flexGrow : 1
    }],
  };

  return (
    <DataTable
      page={page}
      data={outreaches}
      {...props}
    />
  );
};

OutreachesTab.propTypes = {
  view       : PropTypes.object.isRequired,
  outreaches : PropTypes.object,
};

export default OutreachesTab;

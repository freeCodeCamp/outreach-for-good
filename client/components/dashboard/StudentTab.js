import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const StudentTab = ({schools, ...props}) => {
  const page = {
    columns : [{
      title    : 'School',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Student ID',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'First Name',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Last Name',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Grade',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Absences',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Δ',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Tardies',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Δ',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Present',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Enrolled',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'IEP',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'CFA',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Updated',
      id       : 'name',
      flexGrow : 1
    }]
  };

  return (
    <DataTable
      page={page}
      data={schools}
      {...props}
    />
  );
};

StudentTab.propTypes = {
  view    : PropTypes.object.isRequired,
  schools : PropTypes.object.isRequired,
};

export default StudentTab;


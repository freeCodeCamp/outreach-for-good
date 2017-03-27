import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const HomeTab = ({absenceRecords, ...props}) => {
  const page = {
    title   : 'Home Visit Dashboard',
    columns : [{
      title    : 'Name',
      id       : 'name',
      flexGrow : 1
    }, {
      title : 'Actions',
      id    : 'action',
      width : 100
    }]
  };

  return (
    <DataTable
      page={page}
      data={absenceRecords}
      {...props}
    />
  );
};

HomeTab.propTypes = {
  view    : PropTypes.object.isRequired,
  absenceRecords : PropTypes.object.isRequired,
};

export default HomeTab;


import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const CourtTab = ({absenceRecords, ...props}) => {
  const page = {
    title   : 'Court Dashboard',
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

CourtTab.propTypes = {
  view    : PropTypes.object.isRequired,
  absenceRecords : PropTypes.object.isRequired,
};

export default CourtTab;


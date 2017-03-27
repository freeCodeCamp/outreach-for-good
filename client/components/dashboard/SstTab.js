import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const SstTab = ({absenceRecords, ...props}) => {
  const page = {
    title   : 'SST Dashboard',
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

SstTab.propTypes = {
  view    : PropTypes.object.isRequired,
  absenceRecords : PropTypes.object.isRequired,
};

export default SstTab;


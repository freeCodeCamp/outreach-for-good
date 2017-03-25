import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const SstTab = ({schools, ...props}) => {
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
      data={schools}
      {...props}
    />
  );
};

SstTab.propTypes = {
  view    : PropTypes.object.isRequired,
  schools : PropTypes.object.isRequired,
};

export default SstTab;


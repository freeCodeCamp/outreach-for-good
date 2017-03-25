import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const HomeTab = ({schools, ...props}) => {
  const page = {
    title   : 'Manage User Accounts',
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

HomeTab.propTypes = {
  view    : PropTypes.object.isRequired,
  schools : PropTypes.object.isRequired,
};

export default HomeTab;


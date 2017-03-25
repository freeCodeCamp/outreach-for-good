import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const UsersTab = ({users, ...props}) => {
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
      data={users}
      {...props}
    />
  );
};

UsersTab.propTypes = {
  view  : PropTypes.object.isRequired,
  users : PropTypes.object.isRequired,
};

export default UsersTab;


import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const UsersTab = ({view, users, ...props}) => {
  const page = {
    title  : 'Manage User Accounts',
    button : [{
      label   : 'Edit',
      primary : true
    }, {
      label           : 'Remove',
      labelColor      : '#FFFFFF',
      backgroundColor : '#d9534f'
    }]
  };

  const table = {
    width        : view.width,
    maxHeight    : view.height,
    rowHeight    : 35,
    headerHeight : 35
  };

  const columns = [{
    title : 'Name',
    id    : 'name',
    fixed : true
  }, {
    title    : 'Email Address',
    id       : 'email',
    flexGrow : 1
  }, {
    title    : 'Assigned School',
    id       : 'school',
    flexGrow : 1
  }, {
    title    : 'Role',
    id       : 'role',
    flexGrow : 1
  }];

  return (
    <DataTable
      page={page}
      table={table}
      column={columns}
      data={users}
      {...props}
    />
  );
};

UsersTab.propTypes = {
  view     : PropTypes.object.isRequired,
  users    : PropTypes.array.isRequired,
  callback : PropTypes.func.isRequired,
};

export default UsersTab;


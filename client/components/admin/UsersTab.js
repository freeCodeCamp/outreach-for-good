import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const UsersTab = ({view, users, ...props}) => {
  const page = {
    title  : 'Manage User Accounts',
    button : [{
      label   : 'Edit',
      primary : true
    }, {
      label     : 'Remove',
      secondary : true
    }]
  };

  const table = {
    width        : view.width,
    height       : view.height,
    rowHeight    : 50,
    headerHeight : 50
  };

  const columns = [{
    title : '',
    id    : '_id',
    width : 20,
    fixed : true
  }, {
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


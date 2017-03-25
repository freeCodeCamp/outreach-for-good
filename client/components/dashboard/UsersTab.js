import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const UsersTab = ({view, users}) => {
  const columnDefs = [{
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
  }, {
    title    : 'Actions',
    id       : 'action',
    width : 100
  }];

  const tableProps = {
    table : {
      width  : view.width,
      height : view.height,
    },
    rowHeight    : 50,
    headerHeight : 50
  };

  return (
    <DataTable
      table={tableProps}
      column={columnDefs}
      data={users}
    />
  );
};

UsersTab.propTypes = {
  view  : PropTypes.object.isRequired,
  users : PropTypes.array.isRequired,
};

export default UsersTab;


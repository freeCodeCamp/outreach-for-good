import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

import {Immutable, Map} from 'immutable';
import User from '../../models/UserModel';
import UserList from '../../models/UserListModel';

const SchoolsTab = ({view, schools, ...props}) => {
  const page = {
    title : 'Schools'
  };

  const table = {
    width        : view.width,
    maxHeight    : view.height,
    rowHeight    : 35,
    headerHeight : 35
  };

  const columns = [{
    title : 'School Name',
    id    : 'name',
    fixed : true
  }, {
    title    : 'Work',
    id       : 'email',
    flexGrow : 1
  }, {
    title    : 'In Progress',
    id       : 'school',
    flexGrow : 1
  }];

  return (
    <DataTable
      page={page}
      table={table}
      column={columns}
      data={schools}
      {...props}
    />
  );
};

SchoolsTab.propTypes = {
  view         : PropTypes.object.isRequired,
  schools      : PropTypes.instanceOf(UserList).isRequired,
  clickHandler : PropTypes.func.isRequired,
};

export default SchoolsTab;


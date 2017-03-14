import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const SchoolsTab = ({view, schools}) => {
  const page = {
    title : 'Schools'
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
      data={schools}
    />
  );
};

SchoolsTab.propTypes = {
  view    : PropTypes.object.isRequired,
  schools : PropTypes.array.isRequired,
};

export default SchoolsTab;


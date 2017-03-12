import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const StudentTab = ({view, schools}) => {
  const columnDefs = [{
    title : 'School',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Student ID',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'First Name',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Last Name',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Grade',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Absences',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Δ',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Tardies',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Δ',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Present',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Enrolled',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'IEP',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'CFA',
    id    : 'name',
    flexGrow : 1
  }, {
    title : 'Updated',
    id    : 'name',
    flexGrow : 1
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
      data={schools}
    />
  );
};

StudentTab.propTypes = {
  view    : PropTypes.object.isRequired,
  schools : PropTypes.array.isRequired,
};

export default StudentTab;


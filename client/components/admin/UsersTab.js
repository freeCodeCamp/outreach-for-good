import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const UsersTab = ({view, users}) => {
  const columnDefs = [{
    title : '',
    id    : 'selected',
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

  const tableProps = {
    table : {
      width  : view.width,
      height : view.height,
    },
    rowHeight    : 50,
    headerHeight : 50
  };

  return (
    <div className="admin-page-tab">
      <div className="admin-page-title">
        <h3>Manage User Accounts</h3>
        <div className="buttons">
          <RaisedButton label="Edit" primary disabled />
          <RaisedButton label="Remove" secondary disabled />
        </div>
      </div>
      <Paper className="display-paper">
        <DataTable
          table={tableProps}
          column={columnDefs}
          data={users}
        />
      </Paper>
    </div>
  );
};

UsersTab.propTypes = {
  view  : PropTypes.object.isRequired,
  users : PropTypes.array.isRequired,
};

export default UsersTab;


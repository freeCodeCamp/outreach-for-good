import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const UsersTab = ({view, users, ...props}) => {
  const page = {
    title  : 'Manage User Accounts',
    button : [{
      label           : 'se',
      labelColor      : '#FFFFFF',
      backgroundColor : '#124e78',
      menu            : {
        open   : props.openMenus.se,
        anchor : props.openMenus.anchor,
        item   : [{
          text : '1'
        }, {
          text : '2'
        }]
      }
    }, {
      label           : 'Edit',
      labelColor      : '#FFFFFF',
      backgroundColor : '#124e78',
      menu            : {
        open   : props.openMenus.edit,
        anchor : props.openMenus.anchor,
        item   : [{
          text : 'Assigned School'
        }, {
          text : 'User Role'
        }]
      }
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
    <div>
      <DataTable
        page={page}
        table={table}
        column={columns}
        data={users}
        {...props}
      />
      {/*<Dialog
        title="Dialog With Actions"
        actions={actions}
        modal={true}
        open={props.dialog.open}
      >
        Only actions can close this dialog.
      </Dialog>*/}
    </div>
  );
};

UsersTab.propTypes = {
  view     : PropTypes.object.isRequired,
  users    : PropTypes.array.isRequired,
  callback : PropTypes.func.isRequired,
};

export default UsersTab;


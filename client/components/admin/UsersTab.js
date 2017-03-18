import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const UsersTab = ({view, users, ...props}) => {
/**
 * Configure: Material-UI <Dialog>
 *  1. Add new <Dialog> defs to `const dialogs [..]`
 *  2. Set `props` to an object with Dialog properties
 *  3. Minimum properties include
 *     - open (set to state variable true/false)
 *     - actions (React element(s) to close dialog)
 */
  function actionHandler(event) {
    event.preventDefault();
    //console.log(event);
    props.clickHandler('dialogClick', this.value, event); // eslint-disable-line no-invalid-this
  }
  function dropdownHandler(event, index, value) {
    event.preventDefault();
    //console.log(event);
    props.clickHandler('dropdownChange', value, event); // eslint-disable-line no-invalid-this
  }

  const editSchoolDialogActions = [
    <FlatButton
      label="Cancel"
      primary
      onTouchTap={actionHandler}
      key='1'
    />,
    <FlatButton
      label="Submit"
      primary
      keyboardFocused
      onTouchTap={actionHandler}
      key='2'
    />
  ];

  const roles = ['guest', 'teacher', 'manager', 'admin', 'super'];

  const dialogs = [{
    title   : 'Change Assigned School',
    open    : props.openDialogs.editSchool,
    actions : editSchoolDialogActions,
    text    : [<div key='0'>
      {'Change the assigned school for '
      + props.selectedRows.description
        .map(row => row.name).join(', ') + ' to '
      + props.selectedDropdownItem},
      <br key='1' />
      <div key='2' style={{textAlign: 'center'}}>
      <DropDownMenu
        value={props.selectedDropdownItem}
        onChange={dropdownHandler}
        key='3'
      >
        {roles.map(role =>
          <MenuItem value={role} primaryText={role} key={role} />
        )}
        </DropDownMenu>
        </div></div>]
  }, {
    title   : 'Change Role',
    open    : props.openDialogs.editRole,
    actions : editSchoolDialogActions,
    text    : [<div key='0'>
      {'Change the assigned school for '
      + props.selectedRows.description
        .map(row => row.name).join(', ') + ' to '
      + props.selectedDropdownItem},
      <br key='1' />
      <div key='2' style={{textAlign: 'center'}}>
      <DropDownMenu
        value={props.selectedDropdownItem}
        onChange={dropdownHandler}
        key='3'
      >
        {roles.map(role =>
          <MenuItem value={role} primaryText={role} key={role} />
        )}
        </DropDownMenu>
        </div></div>]
  }, {
    title   : 'Remove Users',
    open    : props.openDialogs.removeUser,
    actions : editSchoolDialogActions,
    text    : [`
      This changes the school
    `]
  }];
//      ${props.selectedRows.description.map(row => row.name)}
/**
 * Configure: Material-UI <RaisedButton> and <Popover>
 *  1. Add new <RaisedButton> defs to `const raisedButtons [..]`
 *  2. If button has <Popover>, set `menu:` to an object with popover properties
 *  3. Minimum properties include
 *     - open (set to menu-specific state variable true/false)
 *     - item (array of <MenuItem> definitions)
 *  4. If button or menu-item has dialog, add `dialogID`
 */
  const editPopoverMenu = {
    open : props.openMenus.edit,
    item : [{
      text      : 'Assigned School',
      triggerID : 'editSchoolDialog'
    }, {
      text      : 'User Role',
      triggerID : 'editRoleDialog'
    }]
  };

  const raisedButtons = [{
    label           : 'Edit',
    labelColor      : '#FFFFFF',
    backgroundColor : '#124e78',
    menu            : editPopoverMenu,
    triggerID       : 'editPopover'
  }, {
    label           : 'Remove',
    labelColor      : '#FFFFFF',
    backgroundColor : '#d9534f',
    triggerID       : 'removeUserDialog'
  }];

/**
 * Configure: fixed-data-table
 *  1.
 *  2.
 */
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

  const table = {
    width        : view.width,
    maxHeight    : view.height,
    rowHeight    : 35,
    headerHeight : 35
  };

  const page = {
    title : 'Manage User Accounts',
    raisedButtons,
    dialogs
  };

  return (
    <div>
      <DataTable
        page={page}
        table={table}
        column={columns}
        data={users}
        {...props}
      />
    </div>
  );
};

UsersTab.propTypes = {
  view         : PropTypes.object.isRequired,
  users        : PropTypes.array.isRequired,
  openMenus    : PropTypes.object,
  openDialogs  : PropTypes.object,
  clickHandler : PropTypes.func.isRequired,
};

export default UsersTab;


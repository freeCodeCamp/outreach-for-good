import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { List } from 'immutable';
import DialogModel from '../../models/DialogModel';

const UsersTab = ({users, ...props}) => {
/**
 * Configure: Material-UI <Dialog>
 *  1. Add new <Dialog> defs to `const dialogs [..]`
 *  2. Set `props` to an object with Dialog properties
 *  3. Minimum properties include
 *     - open (set to state variable true/false)
 *     - actions (React element(s) to close dialog)
 */
  function buttonHandler(event) {
    event.preventDefault();
    props.clickHandler('dialogClick', this.value, event); // eslint-disable-line no-invalid-this
  }

  function dropdownHandler(event, index, value) {
    event.preventDefault();
    props.clickHandler('dropdownChange', value, event); // eslint-disable-line no-invalid-this
  }

  const roles = ['guest', 'teacher', 'manager', 'admin', 'super'];

  const changeSchoolDialog = new DialogModel({
    title   : 'Change Assigned School',
    open    : props.table.get('MuiDialogs').get('editSchool'),
    actions : [
      { label: 'Cancel', click: buttonHandler },
      { label: 'Save', click: buttonHandler },
    ],
    text : [<div key='0'>
      {`Change the assigned school for ${
       props.table.get('selectedData')
        .map(row => row.name)
        .join(', ')  } to ${
       props.table.get('selectedDropdownItem')}`},
      <br key='1' />
      <div key='2' style={{textAlign: 'center'}}>
      <DropDownMenu
        value={props.table.get('selectedDropdownItem')}
        onChange={dropdownHandler}
        key='3'
      >
        {roles.map(role =>
          <MenuItem value={role} primaryText={role} key={role} />
        )}
        </DropDownMenu>
        </div></div>]
  });

  const changeRoleDialog = new DialogModel({
    title   : 'Change Assigned School',
    open    : props.table.get('MuiDialogs').get('editRole'),
    actions : List([
      { label: 'Cancel', click: buttonHandler },
      { label: 'Remove', click: buttonHandler },
    ]),
    text : [<div key='0'>
      {`Change the assigned school for ${
       props.table.get('selectedData')
        .map(row => row.name)
        .join(', ')  } to ${
       props.table.get('selectedDropdownItem')}`},
      <br key='1' />
      <div key='2' style={{textAlign: 'center'}}>
      <DropDownMenu
        value={props.table.get('selectedDropdownItem')}
        onChange={dropdownHandler}
        key='3'
      >
        {roles.map(role =>
          <MenuItem value={role} primaryText={role} key={role} />
        )}
        </DropDownMenu>
        </div></div>]
  });

  const removeUserDialog = new DialogModel({
    title   : 'Remove Users',
    open    : props.table.get('MuiDialogs').get('removeUser'),
    actions : List([
      { label: 'Cancel', click: buttonHandler },
      { label: 'Remove', click: buttonHandler },
    ]),
    text : [`
      This changes the school
    `]
  });

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
  const editPopover = {
    open : props.table.get('MuiPopovers').get('editPopover'),
    item : [{
      text      : 'Assigned School',
      triggerID : 'editSchool'
    }, {
      text      : 'User Role',
      triggerID : 'editRole'
    }]
  };

  const raisedButtons = [{
    label           : 'Edit',
    labelColor      : '#FFFFFF',
    backgroundColor : '#124e78',
    menu            : editPopover,
    triggerID       : 'editPopover'
  }, {
    label           : 'Remove',
    labelColor      : '#FFFFFF',
    backgroundColor : '#d9534f',
    triggerID       : 'removeUser'
  }];

/**
 * Configure: fixed-data-table
 *  1.
 *  2.
 */

  const page = {
    title   : 'Manage User Accounts',
    dialogs : [
      changeSchoolDialog,
      changeRoleDialog,
      removeUserDialog
    ],
    columns : [{
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
    }],
    raisedButtons,
  };

  return (
    <div>
      <DataTable
        page={page}
        data={users}
        {...props}
      />
    </div>
  );
};

UsersTab.propTypes = {
  users        : PropTypes.instanceOf(List).isRequired,
  table        : PropTypes.object.isRequired,
  clickHandler : PropTypes.func.isRequired,
};

export default UsersTab;


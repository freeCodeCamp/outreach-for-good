import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';
import { List } from 'immutable';

import * as locAct from './localActions';
import DialogModel from '../../models/DialogModel';
import DropdownModel from '../../models/DropdownModel';
import RaisedButtonModel from '../../models/RaisedButtonModel';

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

  let dialogs = [];

  // Defer building dialogs/dropdowns until something is selected
  if(props.table.get('selectedData').first()) {
    const schoolDropdown = new DropdownModel({
      items    : ['guest', 'teacher', 'manager', 'admin', 'super'],
      selected : props.selectedItem || 'teacher',
      onChange : dropdownHandler
    });

    const rolesDropdown = new DropdownModel({
      items    : ['guest', 'teacher', 'manager', 'admin', 'super'],
      selected : props.selectedItem || 'teacher',
      onChange : dropdownHandler
    });

    dialogs.push(new DialogModel({
      title   : 'Change Assigned School',
      open    : props.table.get('MuiDialogs').get(locAct.EDIT_SCHOOL),
      actions : [
        { label: 'Cancel', click: buttonHandler },
        { label: 'Save', click: buttonHandler },
      ],
      text : [<div key='0'>
        {`Change the assigned school for 
        ${props.table.selectedRowsToCsv(props.table, 'name')} to
        ${schoolDropdown.get('selected')}`},
        <br key='1' />
        <div key='2' style={{textAlign: 'center'}}>
        {schoolDropdown.getDropdown(schoolDropdown,
          dropdownHandler, 3)}
        </div></div>]
    }));

    dialogs.push(new DialogModel({
      title   : 'Change User Role',
      open    : props.table.get('MuiDialogs').get(locAct.EDIT_ROLE),
      actions : List([
        { label: 'Cancel', click: buttonHandler },
        { label: 'Save', click: buttonHandler },
      ]),
      text : [<div key='0'>
        {`Change the assigned role of
        ${props.table.selectedRowsToCsv(props.table, 'name')} to
        ${rolesDropdown.get('selected')}`},
        <br key='1' />
        <div key='2' style={{textAlign: 'center'}}>
        {rolesDropdown.getDropdown(rolesDropdown,
          dropdownHandler, 3)}
        </div></div>]
    }));

    dialogs.push(new DialogModel({
      title   : 'Remove Users',
      open    : props.table.get('MuiDialogs').get(locAct.REMOVE_USER),
      actions : List([
        { label: 'Cancel', click: buttonHandler },
        { label: 'Remove', click: buttonHandler },
      ]),
      text : [` Permanently remove
        ${props.table.selectedRowsToCsv(props.table, 'name')}
      `]
    }));
  }

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

  const editButton = new RaisedButtonModel({
    label    : 'Edit',
    actionID : locAct.EDIT,
    menu     : {
      open : props.table.get('MuiPopovers').get(locAct.EDIT),
      item : [{
        text     : 'Assigned School',
        actionID : locAct.EDIT_SCHOOL
      }, {
        text     : 'User Role',
        actionID : locAct.EDIT_ROLE
      }]
    }
  });

  const removeButton = new RaisedButtonModel({
    label           : 'Remove',
    backgroundColor : '#d9534f',
    actionID        : locAct.REMOVE_USER
  });

/**
 * Configure: fixed-data-table
 *  1.
 *  2.
 */

  const page = {
    title   : 'Manage User Accounts',
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
    dialogs,
    raisedButtons : [
      editButton,
      removeButton
    ]
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
  selectedItem : PropTypes.string.isRequired,
  clickHandler : PropTypes.func.isRequired,
};

export default UsersTab;


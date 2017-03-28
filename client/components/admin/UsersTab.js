import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';
import { List } from 'immutable';

import * as locAct from './localActions';
import DialogModel from '../../models/DialogModel';
import DropdownModel from '../../models/DropdownModel';
import RaisedButtonModel from '../../models/RaisedButtonModel';

const UsersTab = ({users, schools, ...props}) => {
/**
 * Handler Functions
 *   - Catch events from page elements and send to parent component
 */
  function buttonHandler(event) {
    event.preventDefault();
    props.clickHandler('dialogClick', this.value, event); // eslint-disable-line no-invalid-this
  }

  function dropdownHandlerSchool(event, index, value) {
    event.preventDefault();
    props.clickHandler('dropdownChange', value, locAct.EDIT_SCHOOL); // eslint-disable-line no-invalid-this
  }

  function dropdownHandlerRole(event, index, value) {
    event.preventDefault();
    props.clickHandler('dropdownChange', value, locAct.EDIT_ROLE); // eslint-disable-line no-invalid-this
  }

  let dialogs = [];

  // Defer building dialogs/dropdowns until something is selected
  if(props.table.get('selectedData').first()) {
    /**
     * Material-UI <Dropdown>
     *  - Used inside <Dialog> prompts
     *  - See DropdownModel for default parameters
     */
    const schoolDropdown = new DropdownModel({
      items    : schools.map(s => s.name),
      selected : props.form.get('field').get('editSchool'),
      onChange : dropdownHandlerSchool
    });

    const rolesDropdown = new DropdownModel({
      items    : ['guest', 'teacher', 'manager', 'admin', 'super'],
      selected : props.form.get('field').get('editRole')
        || 'teacher',
      onChange : dropdownHandlerRole
    });

    /**
     * Material-UI <Dialog>
     *  - `actions:` become <FlatButton>s in dialog
     *  - See DialogModel for default parameters
     */
    dialogs.push(new DialogModel({
      title   : 'Change Assigned School',
      open    : props.table.get('MuiDialogs').get(locAct.EDIT_SCHOOL),
      actions : [
        { label: 'Cancel', click: buttonHandler },
        { label: 'Save', click: buttonHandler, value: locAct.EDIT_SCHOOL },
      ],
      text : [<div key='0'>
        {`Change the assigned school for 
        ${props.table.selectedRowsToCsv(props.table, 'name')} to
        ${schoolDropdown.get('selected')}`},
        <br key='1' />
        <div key='2' style={{textAlign: 'center'}}>
        {schoolDropdown.getDropdown(schoolDropdown, 3)}
        </div></div>]
    }));

    dialogs.push(new DialogModel({
      title   : 'Change User Role',
      open    : props.table.get('MuiDialogs').get(locAct.EDIT_ROLE),
      actions : List([
        { label: 'Cancel', click: buttonHandler },
        { label: 'Save', click: buttonHandler, value: locAct.EDIT_ROLE },
      ]),
      text : [<div key='0'>
        {`Change the assigned role of
        ${props.table.selectedRowsToCsv(props.table, 'name')} to
        ${rolesDropdown.get('selected')}`},
        <br key='1' />
        <div key='2' style={{textAlign: 'center'}}>
        {rolesDropdown.getDropdown(rolesDropdown, 3)}
        </div></div>]
    }));

    dialogs.push(new DialogModel({
      title   : 'Remove Users',
      open    : props.table.get('MuiDialogs').get(locAct.REMOVE_USER),
      actions : List([
        { label: 'Cancel', click: buttonHandler },
        { label: 'Remove', click: buttonHandler, value: locAct.REMOVE_USER },
      ]),
      text : [` Permanently remove
        ${props.table.selectedRowsToCsv(props.table, 'name')}
      `]
    }));
  }

  let buttons = [];

  /**
   * Material-UI <RaisedButton> and <Popover>
   *  - `menu:` become a <Popover> menu under button
   *  - `actionID:` is used by parent to launch dialogs
   *  - See RaisedButtonModel for default parameters
   */
  buttons.push(new RaisedButtonModel({
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
  }));

  buttons.push(new RaisedButtonModel({
    label           : 'Remove',
    backgroundColor : '#d9534f',
    actionID        : locAct.REMOVE_USER
  }));

  /**
   * Fixed-Data-Table Parameters
   *  - basic fixed-data-table column configuration (`id:` = property to display)
   *  - dialogs and buttons are passed in as properties on `page`
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
      id       : 'assignment',
      flexGrow : 1
    }, {
      title    : 'Role',
      id       : 'role',
      flexGrow : 1
    }],
    dialogs,
    buttons
  };
  return (
    <div>
      <DataTable
        page={page}
        data={users.map(iMap =>
          iMap.assignment
          ? iMap.update('assignment', id => id.get('name'))
          : iMap
        )}
        {...props}
      />
    </div>
  );
};

UsersTab.propTypes = {
  users        : PropTypes.instanceOf(List).isRequired,
  schools      : PropTypes.instanceOf(List).isRequired,
  table        : PropTypes.object.isRequired,
  form         : PropTypes.object.isRequired,
  clickHandler : PropTypes.func.isRequired,
};

export default UsersTab;


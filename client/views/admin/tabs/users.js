import React from 'react';
import PropTypes from 'prop-types';

import * as localConst from '../admin.const';

import { List } from 'immutable';

import DataTable from '../../../components/data-table/data-table';
import DialogModel from '../../../models/dialog';
import DropdownModel from '../../../models/dropdown';
import RaisedButtonModel from '../../../models/raised-button';
import './users.scss';

const UsersTab = ({users, schools, ...props}) => {
  /**
   * Handler Functions
   *   - Catch events from page elements and send to parent component
   */
  const handleButtonClick = event => {
    event.preventDefault();
    props.clickHandler('dialogClick', this.value, event); // eslint-disable-line babel/no-invalid-this
  };

  const dropdownHandlerSchool = (event, index, value) => {
    event.preventDefault();
    props.clickHandler('dropdownChange', value, localConst.EDIT_SCHOOL); // eslint-disable-line babel/no-invalid-this
  };

  const dropdownHandlerRole = (event, index, value) => {
    event.preventDefault();
    props.clickHandler('dropdownChange', value, localConst.EDIT_ROLE); // eslint-disable-line babel/no-invalid-this
  };

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
      open    : props.table.get('MuiDialogs').get(localConst.EDIT_SCHOOL),
      actions : [
        { label: 'Cancel', click: handleButtonClick },
        { label: 'Save', click: handleButtonClick, value: localConst.EDIT_SCHOOL },
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
      open    : props.table.get('MuiDialogs').get(localConst.EDIT_ROLE),
      actions : List([
        { label: 'Cancel', click: handleButtonClick },
        { label: 'Save', click: handleButtonClick, value: localConst.EDIT_ROLE },
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
      open    : props.table.get('MuiDialogs').get(localConst.REMOVE_USER),
      actions : List([
        { label: 'Cancel', click: handleButtonClick },
        { label: 'Remove', click: handleButtonClick, value: localConst.REMOVE_USER },
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
    actionID : localConst.EDIT,
    menu     : {
      open : props.table.get('MuiPopovers').get(localConst.EDIT),
      item : [{
        text     : 'Assigned School',
        actionID : localConst.EDIT_SCHOOL
      }, {
        text     : 'User Role',
        actionID : localConst.EDIT_ROLE
      }]
    }
  }));

  buttons.push(new RaisedButtonModel({
    label           : 'Remove',
    backgroundColor : '#d9534f',
    actionID        : localConst.REMOVE_USER
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
    props.table.get('selectedTab') == 'users'
    && <div>
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

import React from 'react';
import PropTypes from 'prop-types';

import * as localActions from '../admin.actions';
import * as localDefs from '../admin.defs';

import { List } from 'immutable';

import DataTableContainer from '../../../components/data-table/data-table-container';
import DialogModel from '../../../models/dialog';
import DropdownModel from '../../../models/dropdown';
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
    props.clickHandler('dropdownChange', value, localActions.EDIT_SCHOOL); // eslint-disable-line babel/no-invalid-this
  };

  const dropdownHandlerRole = (event, index, value) => {
    event.preventDefault();
    props.clickHandler('dropdownChange', value, localActions.EDIT_ROLE); // eslint-disable-line babel/no-invalid-this
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
      open    : props.table.get('MuiDialogs').get(localActions.EDIT_SCHOOL),
      actions : [
        { label: 'Cancel', click: handleButtonClick },
        { label: 'Save', click: handleButtonClick, value: localActions.EDIT_SCHOOL },
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
      open    : props.table.get('MuiDialogs').get(localActions.EDIT_ROLE),
      actions : List([
        { label: 'Cancel', click: handleButtonClick },
        { label: 'Save', click: handleButtonClick, value: localActions.EDIT_ROLE },
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
      open    : props.table.get('MuiDialogs').get(localActions.REMOVE_USER),
      actions : List([
        { label: 'Cancel', click: handleButtonClick },
        { label: 'Remove', click: handleButtonClick, value: localActions.REMOVE_USER },
      ]),
      text : [` Permanently remove
        ${props.table.selectedRowsToCsv(props.table, 'name')}
      `]
    }));
  }

  /**
   * Material-UI <RaisedButton> and <Popover>
   *  - `menu:` become a <Popover> menu under button
   *  - `actionID:` is used by parent to launch dialogs
   *  - See RaisedButtonModel for default parameters
   */
  let buttons = [];
  buttons.push(localDefs.editUserButton(props));
  buttons.push(localDefs.removeUserButton(props));

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
        <DataTableContainer
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

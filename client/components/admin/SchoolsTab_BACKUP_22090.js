import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';
import { List } from 'immutable';

import * as locAct from './localActions';
import DialogModel from '../../models/DialogModel';
import RaisedButtonModel from '../../models/RaisedButtonModel';
<<<<<<< HEAD
import TextFieldModel from '../../models/TextFieldModel';
=======
>>>>>>> devel

const SchoolsTab = ({schools, ...props}) => {
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

<<<<<<< HEAD
  function textFieldHandler(event, newValue) {
    event.preventDefault();
    props.clickHandler('textFieldChange', newValue, event); // eslint-disable-line no-invalid-this
  }

  let dialogs = [];
  let schoolNames = schools.map(i => i.get('name')).toJS();

  const newSchoolTextField = new TextFieldModel({
    label     : 'School Name',
    id        : locAct.NEW_SCHOOL,
    onChange  : textFieldHandler,
    errorText : props.formState.error.NewSchool
  });

  dialogs.push(new DialogModel({
    title   : 'New School',
    open    : props.table.get('MuiDialogs').get(locAct.NEW_SCHOOL),
    actions : List([
      { label: 'Cancel', click: buttonHandler },
      {
        label    : 'Add',
        click    : buttonHandler,
        value    : locAct.NEW_SCHOOL,
        disabled : props.formState.submitDisabled
      },
    ]),
    text : [<div key='0'>
      {'Add a new school to the application'}
      <div key='2' style={{textAlign: 'center'}}>
      {newSchoolTextField.getTextField(newSchoolTextField, 3)}
      </div></div>]
  }));
=======
  let dialogs = [];
>>>>>>> devel

  // Defer building dialogs/dropdowns until something is selected
  if(props.table.get('selectedData').first()) {
    dialogs.push(new DialogModel({
<<<<<<< HEAD
=======
      title   : 'New Schools',
      open    : props.table.get('MuiDialogs').get(locAct.NEW_SCHOOL),
      actions : List([
        { label: 'Cancel', click: buttonHandler },
        { label: 'Add', click: buttonHandler, value: locAct.NEW_SCHOOL },
      ]),
      text : [` Add a new school
      `]
    }));

    dialogs.push(new DialogModel({
>>>>>>> devel
      title   : 'Remove Schools',
      open    : props.table.get('MuiDialogs').get(locAct.REMOVE_SCHOOL),
      actions : List([
        { label: 'Cancel', click: buttonHandler },
        { label: 'Remove', click: buttonHandler, value: locAct.REMOVE_SCHOOL },
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
  const newButton = new RaisedButtonModel({
    label           : 'New',
    backgroundColor : '#009d9d',
<<<<<<< HEAD
    actionID        : locAct.NEW_SCHOOL,
    disabled        : false
=======
    actionID        : locAct.NEW_SCHOOL
>>>>>>> devel
  });

  const removeButton = new RaisedButtonModel({
    label           : 'Remove',
    backgroundColor : '#d9534f',
    actionID        : locAct.REMOVE_SCHOOL
  });

/**
 * Configure: fixed-data-table
 *  1.
 *  2.
 */
  const page = {
    title   : 'Manage School Accounts',
    columns : [{
      title    : 'Name',
      id       : 'name',
      flexGrow : 1
    }],
    dialogs,
    raisedButtons : [
      newButton,
      removeButton
    ]
  };

  return (
    <div>
      <DataTable
        page={page}
        data={schools}
        {...props}
      />
    </div>
  );
};

SchoolsTab.propTypes = {
  schools      : PropTypes.instanceOf(List).isRequired,
  table        : PropTypes.object.isRequired,
<<<<<<< HEAD
  formState    : PropTypes.object.isRequired,
=======
  selectedItem : PropTypes.string.isRequired,
>>>>>>> devel
  clickHandler : PropTypes.func.isRequired,
};

export default SchoolsTab;


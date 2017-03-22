import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';
import { List } from 'immutable';

import * as locAct from './localActions';
import DialogModel from '../../models/DialogModel';
import RaisedButtonModel from '../../models/RaisedButtonModel';

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

  let dialogs = [];

  // Defer building dialogs/dropdowns until something is selected
  if(props.table.get('selectedData').first()) {
    dialogs.push(new DialogModel({
      title   : 'New Schools',
      open    : props.table.get('MuiDialogs').get(locAct.NEW_SCHOOL),
      actions : List([
        { label: 'Cancel', click: buttonHandler },
        { label: 'Add', click: buttonHandler },
      ]),
      text : [` Add a new school
      `]
    }));

    dialogs.push(new DialogModel({
      title   : 'Remove Schools',
      open    : props.table.get('MuiDialogs').get(locAct.REMOVE_SCHOOL),
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
  const newButton = new RaisedButtonModel({
    label    : 'New',
    backgroundColor : '#009d9d',
    actionID : locAct.NEW_SCHOOL
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

  console.log(dialogs)
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
  selectedItem : PropTypes.string.isRequired,
  clickHandler : PropTypes.func.isRequired,
};

export default SchoolsTab;


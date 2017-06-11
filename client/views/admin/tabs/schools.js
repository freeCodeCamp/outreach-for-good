import React from 'react';
import PropTypes from 'prop-types';

import * as localConst from '../admin.const';

import { List } from 'immutable';

import DataTable from '../../../components/data-table/data-table';
import DialogModel from '../../../models/dialog';
import RaisedButtonModel from '../../../models/raised-button';
import TextFieldModel from '../../../models/text-field';

const SchoolsTab = ({schools, ...props}) => {
/**
 * Handler Functions
 *   - Catch events from page elements and send to parent component
 */
  const handleButtonClick = event => {
    event.preventDefault();
    props.clickHandler('dialogClick', this.value, event); // eslint-disable-line babel/no-invalid-this
  };

  const handleInputChange = (event, newValue) => {
    event.preventDefault();
    props.clickHandler('textFieldChange', newValue, event); // eslint-disable-line babel/no-invalid-this
  };

  const handleInputSubmit = event => {
    event.preventDefault();
    props.clickHandler('textFieldEnter', '', event); // eslint-disable-line babel/no-invalid-this
  };

  /**
   * Material-UI <TextField>
   *  - Used inside <Dialog> prompts
   *  - See TextFieldModel for default parameters
   */
  const newSchoolTextField = new TextFieldModel({
    label     : 'School Name',
    id        : localConst.NEW_SCHOOL,
    onChange  : handleInputChange,
    errorText : props.form.get('error').get('newSchool')
  });

  let dialogs = [];

  /**
   * Material-UI <Dialog>
   *  - `actions:` become <FlatButton>s in dialog
   *  - See DialogModel for default parameters
   */
  dialogs.push(new DialogModel({
    title   : 'New School',
    open    : props.table.get('MuiDialogs').get(localConst.NEW_SCHOOL),
    actions : List([
      { label: 'Cancel', click: handleButtonClick },
      {
        label    : 'Add',
        click    : handleButtonClick,
        value    : localConst.NEW_SCHOOL,
        disabled : props.form.get('submitDisabled')
      },
    ]),
    text : [<div key='0'>
      {'Add a new school to the application'}
      <div key='2' style={{textAlign: 'center'}}>
        <form onSubmit={handleInputSubmit} id='NEW_SCHOOL_FORM'>
        {newSchoolTextField.getTextField(newSchoolTextField, 3)}
        </form>
      </div></div>]
  }));

  // Defer building dialogs/dropdowns until something is selected
  if(props.table.get('selectedData').first()) {
    dialogs.push(new DialogModel({
      title   : 'Remove Schools',
      open    : props.table.get('MuiDialogs').get(localConst.REMOVE_SCHOOL),
      actions : List([
        { label: 'Cancel', click: handleButtonClick },
        { label: 'Remove', click: handleButtonClick, value: localConst.REMOVE_SCHOOL },
      ]),
      text : [<div className="alert alert-danger" key='1'>
        <strong key='2'>WARNING!</strong>
        <br key='3' />
        In addition to deleting {props.table.selectedRowsToCsv(props.table, 'name')}, this operation will
        <strong key='4'> permanently</strong> delete:<br key='12' />
        <ul key='5'>
          <li key='6'>Absence Records</li>
          <li key='7'>Assigned students, including associated:
            <ul key='8'>
              <li key='9'>Outreaches</li>
              <li key='10'>Interventions</li>
              <li key='11'>Notes</li>
            </ul>
          </li>
        </ul>
        Also, teachers assigned to this school will have access revoked until reassigned.
      </div>
      ]
    }));
  }

  let buttons = [];

  /**
   * Material-UI <RaisedButton> and <Popover>
   *  - `actionID:` is used by parent to launch dialogs
   *  - See RaisedButtonModel for default parameters
   */
  buttons.push(new RaisedButtonModel({
    label           : 'New',
    backgroundColor : '#009d9d',
    actionID        : localConst.NEW_SCHOOL,
    disabled        : false
  }));

  buttons.push(new RaisedButtonModel({
    label           : 'Remove',
    backgroundColor : '#d9534f',
    actionID        : localConst.REMOVE_SCHOOL
  }));

  /**
   * Fixed-Data-Table Parameters
   *  - basic fixed-data-table column configuration (`id:` = property to display)
   *  - dialogs and buttons are passed in as properties on `page`
   */
  const page = {
    title   : 'Manage School Accounts',
    columns : [{
      title    : 'Name',
      id       : 'name',
      flexGrow : 1
    }],
    dialogs,
    buttons
  };

  return (
    props.table.get('selectedTab') == 'schools'
    && <div>
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
  form         : PropTypes.object.isRequired,
  clickHandler : PropTypes.func.isRequired,
};

export default SchoolsTab;


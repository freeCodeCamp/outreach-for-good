import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../common/data-table/DataTable';
import { List } from 'immutable';

import * as locDef from './partials/localDefinitions';

const StudentTab = ({absenceRecords, ...props}) => {
/**
 * Handler Functions
 *   - Catch events from page elements and send to parent component
 */
  function buttonHandler(event) {
    event.preventDefault();
    props.clickHandler('dialogClick', this.value, event); // eslint-disable-line babel/no-invalid-this
  }

  let buttons = [];

  /**
   * Material-UI <RaisedButton> and <Popover>
   *  - `menu:` become a <Popover> menu under button
   *  - `actionID:` is used by parent to launch dialogs
   *  - See RaisedButtonModel for default parameters
   */
  buttons.push(locDef.filterButton(props));
  buttons.push(locDef.editButton(props));

  const page = {
    title   : 'Students Dashboard',
    columns : locDef.absenceRecordTableColumns,
    buttons
  };

  return (
    <DataTable
      page={page}
      data={absenceRecords}
      {...props}
    />
  );
};

StudentTab.propTypes = {
  absenceRecords : PropTypes.instanceOf(List).isRequired,
  table          : PropTypes.object.isRequired,
  clickHandler   : PropTypes.func.isRequired,
};

export default StudentTab;


import React from 'react';
import PropTypes from 'prop-types';

import * as localDefs from '../dashboard.defs';

import { List } from 'immutable';

import DataTable from '../../../components/data-table/data-table';

const StudentTab = ({absenceRecords, ...props}) => {
/**
 * Handler Functions
 *   - Catch events from page elements and send to parent component
 */
  function handleButtonClick(event) {
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
  buttons.push(localDefs.filterButton(props));
  buttons.push(localDefs.editButton(props));

  const page = {
    title   : 'Students Dashboard',
    columns : localDefs.absenceRecordTableColumns,
    buttons
  };

  return props.table.get('selectedTab') === props.tabName
    ? <DataTable
        page={page}
        data={absenceRecords}
        {...props}
      />
    : null;
};

StudentTab.propTypes = {
  absenceRecords : PropTypes.instanceOf(List).isRequired,
  table          : PropTypes.object.isRequired,
  clickHandler   : PropTypes.func.isRequired,
};

export default StudentTab;


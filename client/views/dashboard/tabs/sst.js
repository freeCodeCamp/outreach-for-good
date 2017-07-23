import React from 'react';
import PropTypes from 'prop-types';

import * as localDefs from '../dashboard.defs';

import { List } from 'immutable';

import DataTableContainer from '../../../components/data-table/data-table-container';

const SstTab = ({absenceRecords, ...props}) => {
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
    title   : 'SST Dashboard',
    columns : localDefs.absenceRecordTableColumns,
    buttons
  };

  return props.table.get('selectedTab') === props.tabName
    ? <DataTableContainer
        page={page}
        data={absenceRecords}
        {...props}
      />
    : null;
};

SstTab.propTypes = {
  absenceRecords : PropTypes.instanceOf(List).isRequired,
  table          : PropTypes.object.isRequired,
  clickHandler   : PropTypes.func.isRequired,
};

export default SstTab;

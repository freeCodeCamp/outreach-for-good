import React from 'react';
import PropTypes from 'prop-types';

import {interventionTableColumns} from '../school-reports.defs';

import * as localDefs from '../school-reports.defs';

import DataTableContainer from '../../../components/data-table/data-table-container';

const InterventionsTab = ({tabData, ...props}) => {

  let buttons = [];

  /**
   * Material-UI <RaisedButton> and <Popover>
   *  - `menu:` become a <Popover> menu under button
   *  - `actionID:` is used by parent to launch dialogs
   *  - See RaisedButtonModel for default parameters
   */
  buttons.push(localDefs.filterButton(props));
  buttons.push(localDefs.tableButton({
    ...props,
    summaryRowAggregateType : props.table.getIn(['groupColumn', 'aggregateType'])
  }));

  const page = {
    title   : 'Interventions',
    columns : interventionTableColumns,
    buttons
  };

  return props.table.get('selectedTab') === props.tabName
    ? <DataTableContainer
        page={page}
        data={tabData}
        {...props}
      />
    : null;
};

InterventionsTab.propTypes = {
  view    : PropTypes.object.isRequired,
  tabData : PropTypes.object,
};

export default InterventionsTab;

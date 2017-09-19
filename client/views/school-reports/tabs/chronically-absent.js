import React from 'react';
import PropTypes from 'prop-types';

import * as localDefs from '../school-reports.defs';
import * as dashboardDefs from '../../dashboard/dashboard.defs';

import DataTableContainer from '../../../components/data-table/data-table-container';

const ChronicallyAbsentTab = ({tabData, ...props}) => {

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
    title   : 'Chronically Absent Students',
    columns : dashboardDefs.absenceRecordTableColumns,
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

ChronicallyAbsentTab.propTypes = {
  view    : PropTypes.object.isRequired,
  tabData : PropTypes.object,
  table   : PropTypes.object,
  tabName : PropTypes.string
};

export default ChronicallyAbsentTab;

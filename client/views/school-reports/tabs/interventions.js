import React from 'react';
import PropTypes from 'prop-types';

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
  buttons.push(localDefs.schoolSelectButton({
    ...props
  }));
  buttons.push(localDefs.filterButton(props));
  buttons.push(localDefs.tableButton({
    ...props,
    summaryRowAggregateType : props.table.getIn(['groupColumn', 'aggregateType'])
  }));

  const pageTitle = props.schools && props.schools.selected
    ? `Interventions - ${props.schools.selected}` : 'Interventions';

  const page = {
    title   : pageTitle,
    columns : localDefs.interventionTableColumns,
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
  view           : PropTypes.object.isRequired,
  tabData        : PropTypes.object,
  selectedSchool : PropTypes.object,
  table          : PropTypes.object,
  schools        : PropTypes.object,
  tabName        : PropTypes.string
};

export default InterventionsTab;

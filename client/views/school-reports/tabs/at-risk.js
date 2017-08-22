import React from 'react';
import PropTypes from 'prop-types';

import { List } from 'immutable';

import * as localDefs from '../school-reports.defs';

import DataTableContainer from '../../../components/data-table/data-table-container';
import RaisedButtonModel from '../../../models/raised-button';

const AtRiskTab = ({atRisk, ...props}) => {
  const page = {
    title   : 'At Risk Students',
    columns : localDefs.defaultTableColumns,
    buttons : [
      new RaisedButtonModel({
        label    : 'Show Student',
        actionID : 'showStudentPage'
      })
    ]
  };

  return (
    <DataTableContainer
      page={page}
      data={atRisk}
      {...props}
    />
  );
};

AtRiskTab.propTypes = {
  view   : PropTypes.object.isRequired,
  atRisk : PropTypes.instanceOf(List).isRequired,
};

export default AtRiskTab;

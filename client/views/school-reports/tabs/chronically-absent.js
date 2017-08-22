import React from 'react';
import PropTypes from 'prop-types';

import * as localDefs from '../school-reports.defs';

import DataTableContainer from '../../../components/data-table/data-table-container';
import RaisedButtonModel from '../../../models/raised-button';

const ChronicallyAbsentTab = ({chronicAbsent, ...props}) => {
  const page = {
    title   : 'Chronically Absent Students',
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
      page = {page}
      data = {chronicAbsent}
      {...props}
    />
  );
};

ChronicallyAbsentTab.propTypes = {
  view          : PropTypes.object.isRequired,
  chronicAbsent : PropTypes.object,
};

export default ChronicallyAbsentTab;

import React from 'react';
import PropTypes from 'prop-types';

import {interventionTableColumns} from '../school-reports.defs';

import DataTableContainer from '../../../components/data-table/data-table-container';

const InterventionsTab = ({interventions, ...props}) => {
  const page = {
    title   : 'Interventions',
    columns : interventionTableColumns
  };

  return (
    <DataTableContainer
      page={page}
      data={interventions}
      {...props}
    />
  );
};

InterventionsTab.propTypes = {
  view          : PropTypes.object.isRequired,
  interventions : PropTypes.object,
};

export default InterventionsTab;

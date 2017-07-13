import React from 'react';
import PropTypes from 'prop-types';

import {interventionTableColumns} from '../school-reports.defs';

import DataTable from '../../../components/data-table/data-table';

const InterventionsTab = ({interventions, ...props}) => {
  const page = {
    title   : 'Interventions',
    columns : interventionTableColumns
  };

  return (
    <DataTable
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

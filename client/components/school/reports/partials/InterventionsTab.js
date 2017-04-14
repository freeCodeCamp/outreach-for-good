import React, {PropTypes} from 'react';
import DataTable from '../../../common/data-table/DataTable';

const InterventionsTab = ({interventions, ...props}) => {
  const page = {
    title   : 'Interventions',
    columns : [{
      title    : 'School',
      id       : 'school',
      flexGrow : 1
    }, {
      title    : 'Last Name',
      id       : 'lastName',
      flexGrow : 1
    }, {
      title    : 'First Name',
      id       : 'firstName',
      flexGrow : 1
    }, {
      title : 'Actions',
      id    : 'action',
      width : 100
    }]
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

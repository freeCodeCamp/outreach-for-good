import React, {PropTypes} from 'react';
import DataTable from '../../../common/data-table/DataTable';

const OutreachesTab = ({outreaches, ...props}) => {
  const page = {
    title   : 'Outreaches',
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
      data={outreaches}
      {...props}
    />
  );
};

OutreachesTab.propTypes = {
  view       : PropTypes.object.isRequired,
  outreaches : PropTypes.object,
};

export default OutreachesTab;

import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const PhoneTab = ({schools, ...props}) => {
  const page = {
    title   : 'Phone Call Dashboard',
    columns : [{
      title    : 'Name',
      id       : 'name',
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
      data={schools}
      {...props}
    />
  );
};

PhoneTab.propTypes = {
  view    : PropTypes.object.isRequired,
  schools : PropTypes.object.isRequired,
};

export default PhoneTab;


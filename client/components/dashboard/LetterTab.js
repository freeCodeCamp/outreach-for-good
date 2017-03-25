import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const LetterTab = ({schools, ...props}) => {
  const page = {
    title   : 'Letters Sent Dashboard',
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

LetterTab.propTypes = {
  view    : PropTypes.object.isRequired,
  schools : PropTypes.object.isRequired,
};

export default LetterTab;


import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const LetterTab = ({absenceRecords, ...props}) => {
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
      data={absenceRecords}
      {...props}
    />
  );
};

LetterTab.propTypes = {
  view    : PropTypes.object.isRequired,
  absenceRecords : PropTypes.object.isRequired,
};

export default LetterTab;


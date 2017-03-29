import React, {PropTypes} from 'react';
import DataTable from '../../common/data-table/DataTable';
import RaisedButtonModel from '../../../models/RaisedButtonModel';
import {Link} from 'react-router';

const ManageTab = ({records, manageRecords, ...props}) => {
  const tempClick = () => {
    console.log('clicked');
  };

  const buttons = [
    new RaisedButtonModel({
      label    : 'Select School',
      actionID : tempClick
    }),
    new RaisedButtonModel({
      label    : 'Delete Record',
      actionID : tempClick
    })
  ];

  const page = {
    title   : 'Manage School Absence Records',
    columns : [{
      title : 'Date',
      id    : 'date',
      fixed : true
    }, {
      title    : 'School Year',
      id       : 'schoolYear',
      flexGrow : 1
    }, {
      title    : 'Entries',
      id       : 'entries.size',
      flexGrow : 1
    }, {
      title    : 'Missing Students',
      id       : 'missingStudents.size',
      flexGrow : 1
    }, {
      title    : 'New Missing Students',
      id       : 'newMissingStudents.size',
      flexGrow : 1
    }],
    buttons
  };

  const studentLinks = manageRecords.map((record, i) =>
    <li key={i}>
      <Link to={`/student/${record.get('_id')}`}>
        Student Name
      </Link>
    </li>
  );

  return (
    <div className="manage-tab">
      <DataTable
        page={page}
        data={records}
        {...props}
      />
      <div className="entries">
        <h3>Student Entries</h3>
        <ul>{studentLinks}</ul>
      </div>
    </div>
  );
};

ManageTab.propTypes = {
  records       : PropTypes.object,
  manageRecords : PropTypes.object
};

export default ManageTab;

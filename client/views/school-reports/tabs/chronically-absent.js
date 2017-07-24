import React from 'react';
import PropTypes from 'prop-types';

import DataTableContainer from '../../../components/data-table/data-table-container';
import RaisedButtonModel from '../../../models/raised-button';

const ChronicallyAbsentTab = ({chronicAbsent, ...props}) => {
  const page = {
    title   : 'Chronically Absent Students',
    columns : [{
      title    : 'Last Name',
      id       : 'student.lastName',
      width    : 125,
      flexGrow : 1,
      fixed    : true
    }, {
      title    : 'First Name',
      id       : 'student.firstName',
      width    : 125,
      flexGrow : 1
    }, {
      title    : 'School',
      id       : 'school.name',
      width    : 125,
      flexGrow : 1
    }, {
      title    : 'Student ID',
      id       : 'student.studentId',
      width    : 90,
      flexGrow : 1
    }, {
      title    : 'Grade',
      id       : '',
      width    : 60,
      flexGrow : 1
    }, {
      title    : 'Absences',
      id       : 'entry.absences',
      width    : 100,
      flexGrow : 1
    }, {
      title    : 'Δ',
      id       : 'entry.absencesDelta',
      width    : 50,
      flexGrow : 1
    }, {
      title    : 'Tardies',
      id       : 'entry.tardies',
      width    : 100,
      flexGrow : 1
    }, {
      title    : 'Δ',
      id       : 'entry.tardiesDelta',
      width    : 50,
      flexGrow : 1
    }, {
      title    : 'Present',
      id       : 'entry.present',
      width    : 75,
      flexGrow : 1
    }, {
      title    : 'Enrolled',
      id       : 'entry.enrolled',
      width    : 75,
      flexGrow : 1
    }, {
      title    : 'IEP',
      id       : 'student.iep',
      width    : 50,
      flexGrow : 1
    }, {
      title    : 'CFA',
      id       : 'student.cfa',
      width    : 50,
      flexGrow : 1
    }, {
      title    : 'Updated',
      id       : '',
      width    : 75,
      flexGrow : 1
    }],
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

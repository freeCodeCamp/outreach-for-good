import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';
import { List } from 'immutable';

import * as locAct from './localActions';
import RaisedButtonModel from '../../models/RaisedButtonModel';

const StudentTab = ({absenceRecords, ...props}) => {
  let buttons = [];

  /**
   * Material-UI <RaisedButton> and <Popover>
   *  - `menu:` become a <Popover> menu under button
   *  - `actionID:` is used by parent to launch dialogs
   *  - See RaisedButtonModel for default parameters
   */
  buttons.push(new RaisedButtonModel({
    label    : 'Filter',
    actionID : locAct.REMOVE_USER
  }));

  buttons.push(new RaisedButtonModel({
    label    : 'Edit',
    actionID : locAct.REMOVE_USER
  }));

  buttons.push(new RaisedButtonModel({
    label    : 'Withdraw',
    actionID : locAct.REMOVE_USER
  }));


  const page = {
    title   : 'Students Dashboard',
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
    buttons
  };

  return (
    <DataTable
      page={page}
      data={absenceRecords}
      {...props}
    />
  );
};

StudentTab.propTypes = {
  absenceRecords : PropTypes.instanceOf(List).isRequired,
};

export default StudentTab;


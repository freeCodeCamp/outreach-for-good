import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

import * as locAct from './localActions';
import RaisedButtonModel from '../../models/RaisedButtonModel';

const StudentTab = ({schools, ...props}) => {
  let buttons = [];

  /**
   * Material-UI <RaisedButton> and <Popover>
   *  - `menu:` become a <Popover> menu under button
   *  - `actionID:` is used by parent to launch dialogs
   *  - See RaisedButtonModel for default parameters
   */
  buttons.push(new RaisedButtonModel({
    label    : 'IEP',
    actionID : locAct.REMOVE_USER
  }));

  buttons.push(new RaisedButtonModel({
    label    : 'CFA',
    actionID : locAct.REMOVE_USER
  }));

  buttons.push(new RaisedButtonModel({
    label    : 'Withdraw',
    actionID : locAct.REMOVE_USER
  }));


  const page = {
    title   : 'Students Dashboard',
    columns : [{
      title    : 'School',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Student ID',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'First Name',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Last Name',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Grade',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Absences',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Δ',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Tardies',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Δ',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Present',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Enrolled',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'IEP',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'CFA',
      id       : 'name',
      flexGrow : 1
    }, {
      title    : 'Updated',
      id       : 'name',
      flexGrow : 1
    }],
    buttons
  };

  return (
    <DataTable
      page={page}
      data={schools}
      {...props}
    />
  );
};

StudentTab.propTypes = {
  view    : PropTypes.object.isRequired,
  schools : PropTypes.object.isRequired,
};

export default StudentTab;


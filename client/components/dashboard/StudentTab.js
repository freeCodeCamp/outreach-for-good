import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';
import { List } from 'immutable';

import * as locAct from './localActions';
import RaisedButtonModel from '../../models/RaisedButtonModel';

const StudentTab = ({absenceRecords, ...props}) => {
/**
 * Handler Functions
 *   - Catch events from page elements and send to parent component
 */
  function buttonHandler(event) {
    event.preventDefault();
    props.clickHandler('dialogClick', this.value, event); // eslint-disable-line no-invalid-this
  }

  let buttons = [];

  /**
   * Material-UI <RaisedButton> and <Popover>
   *  - `menu:` become a <Popover> menu under button
   *  - `actionID:` is used by parent to launch dialogs
   *  - See RaisedButtonModel for default parameters
   */
  buttons.push(new RaisedButtonModel({
    label    : 'Filter',
    actionID : locAct.FILTER,
    menu     : {
      open : props.table.get('MuiPopovers').get(locAct.FILTER),
      item : [{
        text     : 'Withdrawn Students',
        actionID : locAct.IEP_ADD
      }, {
        text : 'Divider',
      }, {
        text     : 'All Years',
        actionID : locAct.IEP_REMOVE
      }, {
        text     : '2016-2017',
        actionID : locAct.CFA_ADD
      }, {
        text     : '2015-2016',
        actionID : locAct.CFA_REMOVE
      }]
    }
  }));

  buttons.push(new RaisedButtonModel({
    label    : 'Edit',
    actionID : locAct.EDIT,
    menu     : {
      open : props.table.get('MuiPopovers').get(locAct.EDIT),
      item : [{
        text :
          <div>
            <i className="fa fa-plus-circle dashboard-circle-plus" />
            &nbsp; IEP Selected
          </div>,
        actionID : locAct.IEP_ADD
      }, {
        text :
          <div>
            <i className="fa fa-minus-circle dashboard-circle-minus" />
            &nbsp; IEP Selected
          </div>,
        actionID : locAct.IEP_REMOVE
      }, {
        text : 'Divider',
      }, {
        text :
          <div>
            <i className="fa fa-plus-circle dashboard-circle-plus" />
            &nbsp; CFA Selected
          </div>,
        actionID : locAct.CFA_ADD
      }, {
        text :
          <div>
            <i className="fa fa-minus-circle dashboard-circle-minus" />
            &nbsp; CFA Selected
          </div>,
        actionID : locAct.CFA_REMOVE
      }, {
        text : 'Divider',
      }, {
        text :
          <div>
            <i className="fa fa-plus-circle dashboard-circle-plus" />
            &nbsp; Withdraw Selected
          </div>,
        actionID : locAct.WITHDRAW_STUDENT
      }, {
        text :
          <div>
            <i className="fa fa-minus-circle dashboard-circle-minus" />
            &nbsp; Withdraw Selected
          </div>,
        actionID : locAct.ENROLL_STUDENT
      }]
    }
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
  table          : PropTypes.object.isRequired,
  clickHandler   : PropTypes.func.isRequired,
};

export default StudentTab;


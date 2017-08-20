import React from 'react';

import * as localActions from './dashboard.actions';

import FontIcon from 'material-ui/FontIcon';
import RaisedButtonModel from '../../models/raised-button';
import * as dataTableActions from '../../components/data-table/data-table.actions';

export const absenceRecordTableColumns = [{
  title    : '+',
  id       : 'school.name',
  width    : 30,
  flexGrow : 1,
  fixed    : true
}, {
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
  title    : 'Student ID',
  id       : 'student.studentId',
  width    : 90,
  flexGrow : 1
}, {
  title    : 'Grade',
  id       : 'student.grade',
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
  type     : dataTableActions.FORMAT_CHECK,
  width    : 50,
  flexGrow : 1
}, {
  title    : 'CFA',
  id       : 'student.cfa',
  type     : dataTableActions.FORMAT_CHECK,
  width    : 50,
  flexGrow : 1
}, {
  title    : 'Updated',
  id       : 'dateFormatted',
  type     : dataTableActions.FORMAT_DATE,
  width    : 75,
  flexGrow : 1
}];

export const filterButton = props =>
  new RaisedButtonModel({
    label           : 'Filter',
    actionID        : localActions.FILTER,
    backgroundColor : '#009d9d',
    disabled        : false,
    menu            : {
      open : props.table.get('MuiPopovers').get(localActions.FILTER),
      item : filterButtonMenuItems(props)
    }
  });

export const filterButtonMenuItems = props => [{
  text :
    <div>
      { props.withdrawnStudents
        ? <i className="fa fa-check-square-o" />
        : <i className="fa fa-square-o" />
      }
      &nbsp; Withdrawn Students
    </div>,
  actionID : localActions.TOGGLE_WITHDRAWN_STUDENTS
}, {
  text : 'Divider',
}, {
  text     : 'All Years',
  actionID : localActions.ALL_YEARS
}, {
  text     : '2016-2017',
  actionID : localActions.Y2016_Y2017
}, {
  text     : '2015-2016',
  actionID : localActions.Y2015_Y2016
}];

export const editButton = props =>
  new RaisedButtonModel({
    label    : 'Edit',
    actionID : localActions.EDIT,
    menu     : {
      open : props.table.get('MuiPopovers').get(localActions.EDIT),
      item : editButtonMenuItems
    }
  });

export const editButtonMenuItems = [{
  text :
    <div>
      <i className="fa fa-plus-circle dashboard-circle-plus" />
      &nbsp; IEP Selected
    </div>,
  actionID : localActions.IEP_ADD
}, {
  text :
    <div>
      <i className="fa fa-minus-circle dashboard-circle-minus" />
      &nbsp; IEP Selected
    </div>,
  actionID : localActions.IEP_REMOVE
}, {
  text : 'Divider',
}, {
  text :
    <div>
      <i className="fa fa-plus-circle dashboard-circle-plus" />
      &nbsp; CFA Selected
    </div>,
  actionID : localActions.CFA_ADD
}, {
  text :
    <div>
      <i className="fa fa-minus-circle dashboard-circle-minus" />
      &nbsp; CFA Selected
    </div>,
  actionID : localActions.CFA_REMOVE
}, {
  text : 'Divider',
}, {
  text :
    <div>
      <i className="fa fa-plus-circle dashboard-circle-plus" />
      &nbsp; Withdraw Selected
    </div>,
  actionID : localActions.WITHDRAW_ADD
}, {
  text :
    <div>
      <i className="fa fa-minus-circle dashboard-circle-minus" />
      &nbsp; Withdraw Selected
    </div>,
  actionID : localActions.WITHDRAW_REMOVE
}];

export const tableButton = props =>
  new RaisedButtonModel({
    icon      : <FontIcon className="fa fa-chevron-down" />,
    className : 'table-button',
    actionID  : localActions.TABLE,
    disabled  : false,
    menu      : {
      open : props.table.get('MuiPopovers').get(localActions.TABLE),
      item : tableButtonMenuItems
    }
  });

export const tableButtonMenuItems = [{
  text :
    <div>
      <i className="fa fa-plus-circle dashboard-circle-plus" />
      &nbsp; IEP Selected
    </div>,
  actionID : localActions.IEP_ADD
}, {
  text :
    <div>
      <i className="fa fa-minus-circle dashboard-circle-minus" />
      &nbsp; IEP Selected
    </div>,
  actionID : localActions.IEP_REMOVE
}, {
  text : 'Divider',
}, {
  text :
    <div>
      <i className="fa fa-plus-circle dashboard-circle-plus" />
      &nbsp; CFA Selected
    </div>,
  actionID : localActions.CFA_ADD
}, {
  text :
    <div>
      <i className="fa fa-minus-circle dashboard-circle-minus" />
      &nbsp; CFA Selected
    </div>,
  actionID : localActions.CFA_REMOVE
}, {
  text : 'Divider',
}, {
  text :
    <div>
      <i className="fa fa-plus-circle dashboard-circle-plus" />
      &nbsp; Withdraw Selected
    </div>,
  actionID : localActions.WITHDRAW_ADD
}, {
  text :
    <div>
      <i className="fa fa-minus-circle dashboard-circle-minus" />
      &nbsp; Withdraw Selected
    </div>,
  actionID : localActions.WITHDRAW_REMOVE
}];

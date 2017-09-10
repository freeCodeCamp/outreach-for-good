import React from 'react';

import * as localActions from './school-reports.actions';

import FontIcon from 'material-ui/FontIcon';
import RaisedButtonModel from '../../models/raised-button';
import * as tableActions from '../../components/data-table/data-table.actions';

export const defaultTableColumns = [{
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
}];

export const interventionTableColumns = [{
  title    : 'School Name',
  id       : 'school.name',
  width    : 125,
  flexGrow : 1,
  fixed    : true
}, {
  title    : 'Intervention Type',
  id       : '',
  flexGrow : 1,
  fixed    : true
}, {
  title    : 'Student ID',
  id       : 'student.studentId',
  width    : 125,
  flexGrow : 1,
  fixed    : true
}, {
  title    : 'Last Name',
  id       : 'student.lastName',
  flexGrow : 1,
  fixed    : true
}, {
  title    : 'First Name',
  id       : 'student.firstName',
  flexGrow : 1,
  fixed    : true
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

export const filterButtonMenuItems = props => [getWithdrawnItem(props)];

const getWithdrawnItem = props => ({
  text :
    <div>
      { props.withdrawnStudents
        ? <i className="fa fa-check-square-o" />
        : <i className="fa fa-square-o" />
      }
      &nbsp; Withdrawn Students
    </div>,
  actionID : localActions.TOGGLE_WITHDRAWN_STUDENTS
});

export const tableButton = props =>
  new RaisedButtonModel({
    icon      : <FontIcon className="fa fa-chevron-down" />,
    className : 'table-button',
    actionID  : localActions.TABLE,
    disabled  : false,
    menu      : {
      open : props.table.get('MuiPopovers').get(localActions.TABLE),
      item : tableButtonMenuItems(props)
    }
  });

export const tableButtonMenuItems = props => [{
  text     : <div>{'Export all to .csv'}</div>,
  actionID : localActions.EXPORT_CSV
}, getDivider(), {
  text     : <div>{'Clear all filters'}</div>,
  actionID : localActions.CLEAR_FILTERS
}, getDivider(), {
  text :
    <div>
      {props.summaryRowAggregateType == 'sum'
        ? <i className="fa fa-check-square-o" />
        : <i className="fa fa-square-o" />
      }
      &nbsp; Sum
    </div>,
  actionID : tableActions.SET_AGGREGATE_SUM
}, {
  text :
    <div>
      {props.summaryRowAggregateType == 'average'
        ? <i className="fa fa-check-square-o" />
        : <i className="fa fa-square-o" />
      }
      &nbsp; Average
    </div>,
  actionID : tableActions.SET_AGGREGATE_AVERAGE
}, {
  text :
    <div>
      {props.summaryRowAggregateType == 'maximum'
        ? <i className="fa fa-check-square-o" />
        : <i className="fa fa-square-o" />
      }
      &nbsp; Maximum
    </div>,
  actionID : tableActions.SET_AGGREGATE_MAXIMUM
}, {
  text :
    <div>
      {props.summaryRowAggregateType == 'minimum'
        ? <i className="fa fa-check-square-o" />
        : <i className="fa fa-square-o" />
      }
      &nbsp; Minimum
    </div>,
  actionID : tableActions.SET_AGGREGATE_MINIMUM
}];

const getDivider = visible => visible !== false && ({ text: 'Divider' });

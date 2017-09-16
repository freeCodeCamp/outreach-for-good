import React from 'react';

import * as localActions from './school-reports.actions';

import FontIcon from 'material-ui/FontIcon';
import RaisedButtonModel from '../../models/raised-button';
import * as tableActions from '../../components/data-table/data-table.actions';

export const outreachTableColumns = [{
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
  title    : 'Phone',
  id       : 'PhoneCall.count',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Outstanding',
  id       : 'PhoneCall.outstanding',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Resolved',
  id       : 'PhoneCall.resolved',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Letter',
  id       : 'LetterSent.count',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Outstanding',
  id       : 'LetterSent.outstanding',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Resolved',
  id       : 'LetterSent.resolved',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Home',
  id       : 'HomeVisit.count',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Outstanding',
  id       : 'HomeVisit.outstanding',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Resolved',
  id       : 'HomeVisit.resolved',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'SST',
  id       : 'SSTReferral.count',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Outstanding',
  id       : 'SSTReferral.outstanding',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Resolved',
  id       : 'SSTReferral.resolved',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Court',
  id       : 'CourtReferral.count',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Outstanding',
  id       : 'CourtReferral.outstanding',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Resolved',
  id       : 'CourtReferral.resolved',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Total',
  id       : 'total.count',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Outstanding',
  id       : 'total.outstanding',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'Resolved',
  id       : 'total.resolved',
  width    : 45,
  flexGrow : 1
}, {
  title    : 'CFA',
  id       : 'student.cfa',
  type     : tableActions.FORMAT_CHECK,
  width    : 45,
  flexGrow : 1
}];

export const interventionTableColumns = [{
  title    : '+',
  id       : 'type',
  width    : 30,
  flexGrow : 1,
  fixed    : true
}, {
  title    : 'School Name',
  id       : 'school.name',
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

export const schoolButtons = props =>
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

export const filterButtonMenuItems = props => [getWithdrawnItem(props)];

export const schoolSelectButton = props =>
  new RaisedButtonModel({
    label     : 'School',
    className : 'table-button',
    actionID  : localActions.SCHOOL,
    disabled  : false,
    menu      : {
      open : props.table.get('MuiPopovers').get(localActions.SCHOOL),
      item : schoolSelectMenuItems(props.schools)
    }
  });

export const schoolSelectMenuItems = props => props &&
  props.available.map(school => ({
    text :
      <div>
        {props.selected == school
          ? <i className="fa fa-check-square-o" />
          : <i className="fa fa-square-o" />
        }
        &nbsp; {school}
      </div>,
    actionID : {id: localActions.UPDATE_SCHOOL, school}
  })) || [];

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

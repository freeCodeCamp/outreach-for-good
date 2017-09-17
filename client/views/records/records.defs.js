import React from 'react';

import * as localActions from './records.actions';

import RaisedButtonModel from '../../models/raised-button';
import * as tableActions from '../../components/data-table/data-table.actions';

export const recordsTableColumns = [
  {
    title    : 'Date',
    id       : 'date',
    flexGrow : 1
  },
  {
    title    : 'School Year',
    id       : 'schoolYear',
    flexGrow : 1
  },
  {
    title    : 'Total Entries',
    id       : 'entries',
    flexGrow : 1
  },
  {
    title    : 'Total New Missing Students',
    id       : 'newMissingStudents',
    flexGrow : 1
  },
  {
    title    : 'Created Students',
    id       : 'createdStudents',
    flexGrow : 1
  }
];

export const schoolSelectButton = props =>
  new RaisedButtonModel({
    label     : 'School',
    className : 'table-button',
    actionID  : localActions.UPDATE_SCHOOL,
    disabled  : false,
    menu      : {
      open : props.table.get('MuiPopovers').get(localActions.UPDATE_SCHOOL),
      item : schoolSelectMenuItems(props.schools)
    }
  });

export const schoolSelectMenuItems = props => props &&
  props.available.map(school => ({
    text :
      <div>
        {props.selected == school.name
          ? <i className="fa fa-check-square-o" />
          : <i className="fa fa-square-o" />
        }
        &nbsp; {school.name}
      </div>,
    actionID : {id: localActions.UPDATE_SCHOOL, school: school.id}
  })) || [];

export const deleteRecordButton = () =>
  new RaisedButtonModel({
    label           : 'Remove',
    backgroundColor : '#d9534f',
    actionID        : localActions.DELETE_RECORD
  });

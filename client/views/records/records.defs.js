import React from 'react';

import * as localActions from './records.actions';

import RaisedButtonModel from '../../models/raised-button';
import * as tableActions from '../../components/data-table/data-table.actions';

export const recordsTableColumns = [
  {
    title    : 'Date',
    id       : 'dateString',
    width    : 200,
    flexGrow : 1
  },
  {
    title    : 'School Year',
    id       : 'schoolYear',
    width    : 200,
    flexGrow : 1
  },
  {
    title    : 'Total Entries',
    id       : 'entryCount',
    width    : 100,
    flexGrow : 1
  },
  {
    title    : 'Missing Students',
    id       : 'missingStudentsCount',
    width    : 100,
    flexGrow : 1
  },
  {
    title    : 'Created Students',
    id       : 'createdStudentsCount',
    width    : 100,
    flexGrow : 1
  }
];

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
        {props.selected && props.selected.name == school.name
          ? <i className="fa fa-check-square-o" />
          : <i className="fa fa-square-o" />
        }
        &nbsp; {school.name}
      </div>,
    actionID : {action: localActions.UPDATE_SCHOOL, name: school.name, id: school.id}
  })) || [];

export const deleteRecordButton = () =>
  new RaisedButtonModel({
    label           : 'Remove',
    backgroundColor : '#d9534f',
    enableFirst     : true,
    actionID        : localActions.DELETE_RECORD
  });

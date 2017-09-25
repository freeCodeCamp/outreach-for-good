import * as localActions from './admin.actions';

import RaisedButtonModel from '../../models/raised-button';

export const editUserButton = props =>
  new RaisedButtonModel({
    label    : 'Edit',
    actionID : localActions.EDIT,
    menu     : {
      open : props.table.get('MuiPopovers').get(localActions.EDIT),
      item : [{
        text     : 'Assigned School',
        actionID : localActions.EDIT_SCHOOL
      }, {
        text     : 'User Role',
        actionID : localActions.EDIT_ROLE
      }]
    }
  });

export const removeUserButton = () =>
  new RaisedButtonModel({
    label           : 'Remove',
    backgroundColor : '#d9534f',
    actionID        : localActions.REMOVE_USER
  });

export const newSchoolButton = () =>
  new RaisedButtonModel({
    label           : 'New',
    backgroundColor : '#009d9d',
    actionID        : localActions.NEW_SCHOOL,
    disabled        : false
  });

export const removeSchoolButton = () =>
  new RaisedButtonModel({
    label           : 'Remove',
    backgroundColor : '#d9534f',
    actionID        : localActions.REMOVE_SCHOOL
  });

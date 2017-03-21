import React from 'react';
import Immutable from 'immutable';
import FlatButton from 'material-ui/FlatButton';

export const Dialog = Immutable.Record({
  title   : '',
  open    : '',
  actions : Immutable.List(),
  text    : Immutable.List(),
});

class DialogModel extends Dialog {

  addDialogs(currentState, dialogValues) {
    return currentState.update('MuiDialogs', i => i.clear().merge(dialogValues));
  }

  toggleDialogs(currentState, dialogValue) {
    return currentState.update('MuiDialogs', iMap =>
      iMap.update(dialogValue, state => !state));
  }

  resetDialogs(currentState) {
    return currentState.update('MuiDialogs', iMap => iMap.map(() => false));
  }

  getActionButton(label, onTouchTap, key) {
    return <FlatButton
      label={label}
      primary
      onTouchTap={onTouchTap}
      value={label}
      key={key}
    />;
  }
}

export default DialogModel;

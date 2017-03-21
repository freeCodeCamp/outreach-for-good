import React from 'react';
import Immutable from 'immutable';
import FlatButton from 'material-ui/FlatButton';

export const Dialog = Immutable.Record({
  title   : '',
  open    : '',
  actions : Immutable.List(),
  text    : Immutable.List(),
  result  : '',
});

class DialogModel extends Dialog {

  addDialogs(currentState, dialogValues) {
    return currentState.update('MuiDialogs', i => i.clear().merge(dialogValues));
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

  setResult(currentState, result) {
    return currentState.update('result', () => result);
  }
}

export default DialogModel;

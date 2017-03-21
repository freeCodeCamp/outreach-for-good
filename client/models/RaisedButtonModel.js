import React from 'react';
import Immutable from 'immutable';
import FlatButton from 'material-ui/FlatButton';

export const RaisedButton = Immutable.Record({
  label           : '',
  labelColor      : '#FFFFFF',
  backgroundColor : '#124e78',
  triggerID       : '',
  menu            : {}
});

class RaisedButtonModel extends RaisedButton {

  addRaisedButtons(currentState, RaisedButtonValues) {
    return currentState.update('MuiRaisedButtons', i => i.clear().merge(RaisedButtonValues));
  }

  toggleRaisedButtons(currentState, RaisedButtonValue) {
    return currentState.update('MuiRaisedButtons', iMap =>
      iMap.update(RaisedButtonValue, state => !state));
  }

  resetRaisedButtons(currentState) {
    return currentState.update('MuiRaisedButtons', iMap => iMap.map(() => false));
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

export default RaisedButtonModel;

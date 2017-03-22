import React from 'react';
import Immutable from 'immutable';
import FlatButton from 'material-ui/FlatButton';

export const RaisedButton = Immutable.Record({
  label           : '',
  labelColor      : '#FFFFFF',
  backgroundColor : '#124e78',
  actionID        : '',
  menu            : {}
});

class RaisedButtonModel extends RaisedButton {

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

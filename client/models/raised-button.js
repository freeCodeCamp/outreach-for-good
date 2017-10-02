import React from 'react';
import Immutable from 'immutable';
import FlatButton from 'material-ui/FlatButton';

export const RaisedButton = Immutable.Record({
  className       : null,
  label           : null,
  labelColor      : '#FFFFFF',
  icon            : null,
  backgroundColor : '#124e78',
  actionID        : '',
  disabled        : true,
  menu            : {},
  enableFirst     : false
});

class RaisedButtonModel extends RaisedButton {

  getActionButton(label, onTouchTap, key) {
    return (<FlatButton
      label={label}
      primary
      onTouchTap={onTouchTap}
      value={label}
      key={key}
    />);
  }
}

export default RaisedButtonModel;

import React from 'react';
import Immutable from 'immutable';
import TextField from 'material-ui/TextField';

export const Text = Immutable.Record({
  label    : '',
  selected : [],
  onChange : ''
});

class TextFieldModel extends Text {

  addTextField(currentState, DropdownValues) {
    return currentState.update('MuiDropdowns', i => i.clear().merge(DropdownValues));
  }

  getTextField(currentState, key) {
    return <TextField
        floatingLabelText={currentState.label}
        floatingLabelStyle={{fontWeight: 'normal'}}
        key={key}
      />;
  }
}

export default TextFieldModel;

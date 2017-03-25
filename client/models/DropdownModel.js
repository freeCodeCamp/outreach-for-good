import React from 'react';
import Immutable from 'immutable';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export const Dropdown = Immutable.Record({
  items    : [],
  selected : '',
  onChange : ''
});

class DropdownModel extends Dropdown {

  addDropdown(currentState, DropdownValues) {
    return currentState.update('MuiDropdowns', i => i.clear().merge(DropdownValues));
  }

  getDropdown(currentState, key) {
    return <DropDownMenu
        value={currentState.get('selected')}
        onChange={currentState.get('onChange')}
        key={key}
      >
        {currentState.get('items').map(item =>
          <MenuItem
            value={item}
            primaryText={item}
            key={item}
          />
        )}
      </DropDownMenu>;
  }
}

export default DropdownModel;

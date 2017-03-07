import React from 'react';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';


const AuthButton = ({openMenu, toggleMenu, handleMenuItem}) => (
    <IconMenu
      iconButtonElement={
        <FlatButton
          onTouchTap={openMenu}
          label="Login"
          labelStyle={{
            color      : '#FFFFFF',
            fontWeight : '400'
          }}
            />
      }
      anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
      onItemTouchTap={handleMenuItem}
      onRequestChange={toggleMenu}
      style={{
        lineHeight : '55px',
      }}
    >
      <MenuItem value="1" primaryText="Refresh" />
      <MenuItem
        value="2"
        primaryText="Help"
      />
      <MenuItem
        value="logout"
        primaryText="Sign out"
      />
    </IconMenu>
  );

export default AuthButton;

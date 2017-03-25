import React, { PropTypes } from 'react';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';


const AuthButton = ({label, openMenu, toggleMenu, handleMenuItem}) => 
    <IconMenu
      iconButtonElement={
        <FlatButton
          onTouchTap={openMenu}
          label={label.userName}
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
      <MenuItem value="dashboard" primaryText="Dashboard" />
      <MenuItem
        value="logout"
        primaryText="Sign out"
      />
    </IconMenu>
  ;

AuthButton.propTypes = { // Prop type validation
  label          : PropTypes.object.isRequired,
  openMenu       : PropTypes.func.isRequired,
  toggleMenu     : PropTypes.func.isRequired,
  handleMenuItem : PropTypes.func.isRequired
};

export default AuthButton;

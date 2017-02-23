import React, { Component } from 'react';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';


class AuthButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      openMenu      : false,
      valueSingle   : '3',
      valueMultiple : ['3', '5'],
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
  }

  handleOpenMenu() {
    this.setState({
      openMenu : true,
    });
  }

  handleOnRequestChange(value) {
    this.setState({
      openMenu : value,
    });
  }

  render() {
    return (
      <IconMenu
        iconButtonElement={
          <FlatButton
            onTouchTap={this.handleOpenMenu}
            label="Login"
            labelStyle={{
              color      : '#FFFFFF',
              fontWeight : '400'
            }}
             />
        }
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        open={this.state.openMenu}
        onRequestChange={this.handleOnRequestChange}
        style={{
          lineHeight : '55px',
        }}
      >
        <MenuItem value="1" primaryText="Refresh" />
        <MenuItem value="2" primaryText="Help" />
        <MenuItem value="3" primaryText="Sign out" />
      </IconMenu>
    );
  }
}

export default AuthButton;

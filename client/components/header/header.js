import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import * as sessionActions from '../../modules/session';
import * as viewActions from '../../modules/view';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import AuthButton from '../auth-button/auth-button';

class Header extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      openMenu      : false,
      valueSingle   : '3',
      valueMultiple : ['3', '5']
    };

    this.handleExpandSidebar = this.handleExpandSidebar.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleMenuItem = this.handleMenuItem.bind(this);
  }

  handleExpandSidebar() {
    this.props.viewActions.setExpandSidebar(!this.props.view.sidebar.expand);
  }

  openMenu() {
    this.setState({
      openMenu : true,
    });
  }

  toggleMenu(value) {
    this.setState({
      openMenu : value,
    });
  }

  handleMenuItem(event, menuItem) {
    switch (menuItem.props.value) {
    case 'dashboard':
      browserHistory.push('/dashboard');
      break;
    case 'logout':
      this.props.sessionActions.logout();
      browserHistory.push('/login');
      break;
    }
  }

  render() {
    return (
      <AppBar
        className="main-header"
        title={<span style={{fontWeight: 400, fontSize: 20}}>Child First Authority</span>}
        iconElementRight={
          <div>
            <AuthButton
              label = {{
                userName : this.props.session.me.name || 'Login'
              }}
              openMenu = {this.openMenu}
              toggleMenu = {this.toggleMenu}
              handleMenuItem = {this.handleMenuItem}
            />
          </div>
        }
        iconElementLeft={
          <IconButton
            onClick={this.handleExpandSidebar}
            iconStyle={{color: '#EFEFEF'}}
          >
            <NavigationMenu
              className={this.props.view.sidebar.expand ? 'is-expanded' : ''}
            />
          </IconButton>
        }
      />
    );
  }
}

Header.propTypes = { // Prop type validation
  viewActions    : PropTypes.object.isRequired,
  sessionActions : PropTypes.object.isRequired,
  session        : PropTypes.object.isRequired,
  view           : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    session : state.session,
    view    : state.view
  };
}

function mapDispatchToProps(dispatch) {
  return {
    viewActions    : bindActionCreators(viewActions, dispatch),
    sessionActions : bindActionCreators(sessionActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

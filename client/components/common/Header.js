import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as viewActions from '../../actions/viewActions';
import * as sessionActions from '../../actions/sessionActions';
import {browserHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import AuthButton from './AuthButton';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

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
    if(menuItem.props.value == 'logout') {
      this.props.sessionActions.logout();
      browserHistory.push('/login');
    }
  }

  render() {
    return (
      <AppBar
        className="main-header"
        title={<span style={{fontWeight: 400, fontSize: 20}}>Child First Authority</span>}
        iconElementRight={
          <AuthButton
            openMenu = {this.openMenu}
            toggleMenu = {this.toggleMenu}
            handleMenuItem = {this.handleMenuItem}
          />
        }
        iconElementLeft={
          <IconButton
            onClick={this.handleExpandSidebar}
            iconStyle={{color: '#EFEFEF'}}
          >
            <NavigationMenu />
          </IconButton>
        }
      />
    );
  }
}

Header.propTypes = { // Prop type validation
  viewActions    : PropTypes.object.isRequired,
  sessionActions : PropTypes.object.isRequired,
  view           : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    view : state.view
  };
}

function mapDispatchToProps(dispatch) {
  return {
    viewActions    : bindActionCreators(viewActions, dispatch),
    sessionActions : bindActionCreators(sessionActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

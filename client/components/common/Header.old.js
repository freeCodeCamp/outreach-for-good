import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import MediaQuery from 'react-responsive';
import * as headerActions from '../../actions/headerActions';

class Header extends React.Component {
  // constructor(props, context) {
  //   super(props, context);
  // }

  toggleSidebar() {
    this.props.actions.toggleSidebar();
  }

  render() {
    return (
    <navbar>
      <div className="cfa navbar navbar-default">
        <div className="navbar-header fixed-brand">
          <MediaQuery minWidth={768}>
            <a href="#" className="pull-left" onClick={this.toggleSidebar}>
              <i className="fa fa-navicon fa-2x" /> big
            </a>
          </MediaQuery>
          <MediaQuery maxWidth={768}>
            <a href="#" className="pull-left" onClick={this.toggleSidebar}>
              <i className="fa fa-navicon fa-2x" /> small
            </a>
          </MediaQuery>
          <Link to="/dashboard" className="navbar-brand">
            Child First Authority
          </Link>
        </div>
        <div className="navbar-collapse collapse" id="navbar-main" aria-expanded="false" aria-hidden="true">
          <ul className="nav navbar-nav navbar-right">
            <li><p className="navbar-text">Hello Chad Sheets</p></li>
            <li><a href="">Logout</a></li>
          </ul>
        </div>
      </div>
    </navbar>
    );
  }
}

Header.propTypes = { // Prop type validation
  actions : PropTypes.object.isRequired,
  header  : PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    header : state.header
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(headerActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

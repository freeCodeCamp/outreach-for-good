import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import './sidebar.scss';

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      sidebar : this.props.sidebar
    };
  }

  render() {
    let studentRoute = this.props.route.includes('/student');

    return (
    <div id="sidebar">
      <ul className={`sidebar-nav nav-pills nav-stacked ${this.props.sidebar.expand ? 'expanded' : ''}`}>
        <li><Link to="/dashboard" activeClassName="active">
          <span className="fa-stack fa-lg pull-left"><i className="fa fa-stack-1x fa-dashboard" /></span>
          Dashboard
        </Link></li>
        <li><Link to="/visualization" activeClassName="active">
          <span className="fa-stack fa-lg pull-left"><i className="fa fa-stack-1x fa-area-chart" /></span>
          Data Visualization
        </Link></li>
        <li><Link to="/volunteer" activeClassName="active">
          <span className="fa-stack fa-lg pull-left"><i className="fa fa-stack-1x fa-hourglass-o" /></span>
          Volunteer Hours
        </Link></li>
        {(this.props.session.role === 'teacher'
          || this.props.session.role === 'admin'
          || this.props.session.role === 'super')
          && <li><Link to="/records" activeClassName="active">
          <span className="fa-stack fa-lg pull-left"><i className="fa fa-stack-1x fa-file" /></span>
          Records
        </Link></li>}
        <li><Link to="/school/reports" activeClassName="active">
          <span className="fa-stack fa-lg pull-left"><i className="fa fa-stack-1x fa-graduation-cap" /></span>
          School Reports
        </Link></li>
        <li><Link to="/school/settings" activeClassName="active">
          <span className="fa-stack fa-lg pull-left"><i className="fa fa-stack-1x fa-cogs" /></span>
          School Settings
        </Link></li>
        {(this.props.session.role == 'admin'
          || this.props.session.role == 'super')
        && <li><Link to="/admin" activeClassName="active">
          <span className="fa-stack fa-lg pull-left"><i className="fa fa-stack-1x fa-wrench" /></span>
          Admin
        </Link></li>}
        {studentRoute
        && <li><Link to={this.props.route} activeClassName="active">
          <span className="fa-stack fa-lg pull-left"><i className="fa fa-stack-1x fa-user" /></span>
          Student
        </Link></li>}
        <li className="flex-spacer" />
        <li><Link to="/about" activeClassName="active">
          <span className="fa-stack fa-lg pull-left"><i className="fa fa-stack-1x fa-question" /></span>
          About
        </Link></li>
      </ul>
    </div>
    );
  }
}

Sidebar.propTypes = {
  route   : PropTypes.string.isRequired,
  session : PropTypes.object.isRequired,
  sidebar : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  //console.log('Sidebar: ', state);
  return {
    session : state.session.me,
    sidebar : state.view.sidebar
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

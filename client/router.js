import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import * as sessionActions from './modules/session';

import {Router, Route, IndexRoute} from 'react-router';
import cookies from 'browser-cookies';

import App from './views/app';
import { AboutPage } from './views/about/about';
import AdminPage from './views/admin/admin';
import DashboardPage from './views/dashboard/dashboard';
import LoginPage from './views/login/login';
import RecordsPage from './views/records/records';
import SchoolReportsPage from './views/school-reports/school-reports';
import SchoolSettingsPage from './views/school-settings/school-settings';
import StudentPage from './views/student/student';
import UsersPage from './views/users/users';
import VisualizationPage from './views/visualization/visualization';

class RTRouter extends React.Component {
  constructor() {
    super();
    // Configure routes here as this solves a problem with hot loading where
    // the routes are recreated each time.
    this.routes
      = <Route path="/" component={App}>
        <IndexRoute component={LoginPage}/>
        <Route path="/login" component={LoginPage} />
        <Route path="/about" component={AboutPage} onEnter={this.authorize} />
        <Route path="/admin" component={AdminPage} onEnter={this.authorize} />
        <Route path="/dashboard" component={DashboardPage} onEnter={this.authorize} />
        <Route path="/records" component={RecordsPage} onEnter={this.authorize} />
        <Route path="/school/reports" component={SchoolReportsPage} onEnter={this.authorize} />
        <Route path="/school/settings" component={SchoolSettingsPage} onEnter={this.authorize} />
        <Route path="/student/:studentId(/:tab)" component={StudentPage} onEnter={this.authorize} />
        <Route path="/users" component={UsersPage} onEnter={this.authorize} />
        <Route path="/visualization" component={VisualizationPage} onEnter={this.authorize} />
      </Route>
    ;
//        <Route path="/volunteers" component={Volunteers} onEnter={this.authorize} />
  }

  authorize = (nextState, replace) => {
    if(!this.props.session.token) {
      if(!cookies.get('token')) {
        replace({
          pathname : '/login',
          state    : { nextPathname: nextState.location.pathname }
        });
      } else {
        this.props.actions.validate();
      }
    }
  }

  render() {
    const { history } = this.props;
    return (
      <Router
        routes={this.routes}
        history={history}
      />
    );
  }
}

RTRouter.propTypes = { // Prop type validation
  actions : PropTypes.object.isRequired,
  session : PropTypes.object.isRequired,
  history : PropTypes.object
};

function mapStateToProps(state) {
  return {
    session : state.session
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(sessionActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RTRouter);

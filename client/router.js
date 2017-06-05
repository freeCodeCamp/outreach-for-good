import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as authActions from './modules/sessionReducer';
import {Router, Route, IndexRoute} from 'react-router';
import App from './components/App';
import AboutPage from './components/about/AboutPage';
import AdminPage from './components/admin/AdminPage';
import DashboardPage from './components/dashboard/DashboardPage';
import LoginPage from './components/login/LoginPage';
import RecordsPage from './components/records/RecordsPage';
import SchoolReportsPage from './components/school/reports/SchoolReportsPage';
import SchoolSettingsPage from './components/school/settings/SchoolSettingsPage';
import StudentPage from './components/student/StudentPage';
import UsersPage from './components/users/UsersPage';
import VisualizationPage from './components/visualization/VisualizationPage';
import cookies from 'browser-cookies';

class RTRouter extends React.Component {
  constructor() {
    super();

    this.authorize = this.authorize.bind(this);

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
  }

  authorize(nextState, replace) {
    if(!this.props.session.token) {
      if(!cookies.get('token')) {
        replace({
          pathname : '/login',
          state    : { nextPathname: nextState.location.pathname }
        });
      } else {
        //console.log('router validate');
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
};

function mapStateToProps(state, ownProps) {
  return {
    session : state.session
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(authActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RTRouter);

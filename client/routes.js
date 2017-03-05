import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/App';
import AboutPage from './components/about/AboutPage';
import AdminPage from './components/admin/AdminPage';
import DashboardPage from './components/dashboard/DashboardPage';
import LoginPage from './components/login/LoginPage';
import RecordsPage from './components/records/RecordsPage';
import SchoolReportsPage from './components/school/reports/SchoolReportsPage';
import SchoolSettingsPage from './components/school/settings/SchoolSettingsPage';
import UsersPage from './components/users/UsersPage';
import VisualizationPage from './components/visualization/VisualizationPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LoginPage}/>
    <Route path="about" component={AboutPage}/>
    <Route path="admin" component={AdminPage}/>
    <Route path="dashboard" component={DashboardPage}/>
    <Route path="login" component={LoginPage}/>
    <Route path="records" component={RecordsPage}/>
    <Route path="school/reports/at-risk" component={SchoolReportsPage}/>
    <Route path="school/settings" component={SchoolSettingsPage}/>
    <Route path="users" component={UsersPage}/>
    <Route path="visualization" component={VisualizationPage}/>
  </Route>
);

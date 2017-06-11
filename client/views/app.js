import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as sessionActions from '../modules/session';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { getAllSchools } from '../modules/school';
import muiTheme from '../styles/mui-theme.js';
import ResponseSnackbar from '../components/response-snackbar/response-snackbar';
import Header from '../components/header/header';
import Sidebar from '../components/sidebar/sidebar';
import Footer from '../components/footer/footer';

import './app.scss';

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="viewport">
          {this.props.session.token && <Header/>}
          <section className="main-body">
            {this.props.session.token && <Sidebar route={this.props.location.pathname} />}
            <section id="main-view">
              <div id={this.props.session.token ? 'main-content' : 'login-content'}>
                {this.props.children}
                <ResponseSnackbar />
              </div>
              {this.props.session.token && <Footer />}
            </section>
          </section>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children      : PropTypes.object.isRequired,
  session       : PropTypes.object.isRequired,
  location      : PropTypes.object.isRequired,
  getAllSchools : PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    session : state.session
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions       : bindActionCreators(sessionActions, dispatch),
    getAllSchools : bindActionCreators(getAllSchools, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

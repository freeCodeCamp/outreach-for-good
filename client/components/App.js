import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as sessionActions from '../modules/sessionReducer';
import {getAllSchools} from '../modules/schoolReducer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../styles/muiTheme.js';
import ResponseSnackbar from './common/ResponseSnackbar';
import Header from './common/Header';
import Sidebar from './common/Sidebar';
import Footer from './common/Footer';

class App extends Component {
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

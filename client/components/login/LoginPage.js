import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as sessionActions from '../../modules/sessionReducer';
var cookies = require('browser-cookies');
import {browserHistory} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import logo from '../../assets/images/mstile-150x150.png';

class LoginPage extends React.Component {

  componentDidMount() {
    if(cookies.get('token')) {
      this.props.actions.validate();
      browserHistory.push('/dashboard');
    }
  }

  render() {
    return (
      <div className="login-page">
        <img src={logo} />
        <div>
          <div className="login-page-title">
            Student absenteeism tracking and reporting
          </div>
          <RaisedButton
            href="/auth/google"
            label="Sign In with Google"
            labelStyle={{
              fontSize      : '14px',
              textTransform : 'none',
              fontWeight    : '500',
              paddingLeft   : '10px',
            }}
            backgroundColor='#DF4A32'
            labelColor='#FEFFFF'
            className='login-button'
            icon={<FontIcon className="fa fa-google-plus" />}
          />
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = { // Prop type validation
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
    actions : bindActionCreators(sessionActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

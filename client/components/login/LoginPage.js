import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as sessionActions from '../../actions/sessionActions';
var cookies = require('browser-cookies');
import {browserHistory} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

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
        <img src="/assets/images/mstile-150x150.png" />
        <div>
          <RaisedButton
            href="/auth/google"
            label="Sign In with Google"
            backgroundColor='#DF4A32'
            labelColor='#FEFFFF'
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

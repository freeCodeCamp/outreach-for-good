import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as sessionActions from '../../actions/sessionActions';
var cookies = require('browser-cookies');
import {browserHistory} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import {red500} from 'material-ui/styles/colors';

const styles = {
  button : {
    margin : 12
  },
  exampleImageInput : {
    cursor   : 'pointer',
    position : 'absolute',
    top      : 0,
    bottom   : 0,
    right    : 0,
    left     : 0,
    width    : '100%',
    opacity  : 0,
  },
};

class LoginPage extends React.Component {


  // Causes infinite loop
  // componentDidMount() {
  //   this.props.actions.validate();
  //   if(this.props.session.token) {
  //     console.log('componentDidMount, redir')
  //     browserHistory.push('/dashboard');
  //   }
  // }

  // componentWillReceiveProps() {
  //   this.props.actions.validate();
  //   if(this.props.session.token) {
  //     console.log('componentWillReceiveProps, redir')
  //     browserHistory.push('/dashboard');
  //   }
  // }

  render() {
    return (
        <div>
            <h1>Login</h1>

            <RaisedButton
              href="/auth/google"
              label="Sign In with Google"
              style={styles.button}
              color={red500}
            />
            <p>
              Cookies: {JSON.stringify(cookies.get('token'))}
            </p>
            <p>
              <b>To-Do:</b> Redirect automatically
            </p>
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


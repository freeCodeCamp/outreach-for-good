import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as sessionActions from '../../actions/sessionActions';
var cookies = require('browser-cookies');
import {browserHistory} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';

class LoginPage extends React.Component {

  componentDidMount() {
    if(cookies.get('token')) {
      this.props.actions.validate();
      browserHistory.push('/dashboard');
    }
  }

  componentWillReceiveProps() {
    if(cookies.get('token')) {
      this.props.actions.validate();
      browserHistory.push('/dashboard');
    }
  }

  render() {
    return (
      <div style={{padding: 20}}>
        <div style={{textAlign: 'center', paddingTop: 150}}>
          <RaisedButton
            href="/auth/google"
            label="Sign In with Google"
            backgroundColor='#DF4A32'
            labelColor='#FEFFFF'
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

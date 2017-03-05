import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as authActions from '../../actions/authActions';

class LoginPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    console.log('clicked');
    this.props.actions.login();
  }

  render() {
    return (
        <div>
            <h1>Login</h1>
            <button
            onClick={this.clickHandler}
            >Login</button>
            <a href="http://localhost:9000/auth/google">Login</a>
        </div>
    );
  }
}

LoginPage.propTypes = { // Prop type validation
  actions : PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(authActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(LoginPage);

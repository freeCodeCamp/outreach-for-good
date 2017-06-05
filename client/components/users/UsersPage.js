import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../../modules/userReducer';

class UsersPage extends React.Component {
  // constructor(props, context) {
  //   super(props, context);
  // }

  userRow(user, index) {
    return <div key={index}>{user.name}</div>;
  }

  render() {
    return (
      <div>
        <h1>Users</h1>
        {this.props.users.map(this.userRow)}
      </div>
    );
  }
}

UsersPage.propTypes = { // Prop type validation
  actions : PropTypes.object.isRequired,
  users   : PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    users : state.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(userActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);

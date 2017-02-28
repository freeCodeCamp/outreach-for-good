import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';

import Dimensions from 'react-dimensions';
import AdminTable from './AdminTable';

class AdminPage extends React.Component {

  render() {
    return (
        <AdminTable
          data={this.props.users}
          width={this.props.containerWidth}
          height={this.props.containerHeight - 55}
        />
    );
  }
}

AdminPage.propTypes = {
  actions         : PropTypes.object.isRequired,
  users           : PropTypes.array.isRequired,
  containerWidth  : PropTypes.number.isRequired,
  containerHeight : PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    users : state.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(userActions, dispatch)
  };
}

//https://github.com/digidem/react-dimensions/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(AdminPage));

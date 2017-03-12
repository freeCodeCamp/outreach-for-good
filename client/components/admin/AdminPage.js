import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';
import {Tabs, Tab} from 'material-ui/Tabs';

import Dimensions from 'react-dimensions';

import SchoolsTab from './SchoolsTab';
import UsersTab from './UsersTab';

class AdminPage extends React.Component {

  render() {
    return (
      <Tabs
        style={{width: this.props.containerWidth}}
      >
        <Tab label="Users">
          <UsersTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            users = {this.props.users}
          />
        </Tab>
        <Tab label="Schools">
          <SchoolsTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
          />
        </Tab>
      </Tabs>
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

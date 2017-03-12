import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as recordsActions from '../../actions/recordsActions';
import {Tabs, Tab} from 'material-ui/Tabs';

import UploadTab from './components/UploadTab';
import ManageTab from './components/ManageTab';

class RecordsPage extends Component {
  confirm(users) {
    this.props.actions.confirmStudents(users);
  }

  render() {
    return (
      <Tabs>
        <Tab label="Upload"><UploadTab confirm={this.confirm.bind(this)}/></Tab>
        <Tab label="Manage"><ManageTab /></Tab>
      </Tabs>
    );
  }
}

RecordsPage.propTypes = {
  actions : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    session : state.session
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(recordsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordsPage);

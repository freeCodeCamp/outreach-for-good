import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as recordsActions from '../../actions/recordsActions';
import {Tabs, Tab} from 'material-ui/Tabs';

import UploadTab from './components/UploadTab';
import ManageTab from './components/ManageTab';

class RecordsPage extends Component {
  constructor() {
    super();

    this.state = {
      currentTab : 'upload'
    };
  }

  componentDidMount() {
    this.props.actions.getSchools();
  }

  confirm(record) {
    this.props.actions.confirmRecord(record);
  }

  changeTab(tab) {
    this.setState({ currentTab : tab });
  }

  render() {
    return (
      <Tabs
        value={this.state.currentTab}
        onChange={this.changeTab.bind(this)}
        >
        <Tab
          label="Upload"
          value="upload">
          <UploadTab
            changeTab={this.changeTab.bind(this)}
            confirm={this.confirm.bind(this)}
            schools={this.props.records.schools}
          />
        </Tab>
        <Tab
          label="Manage"
          value="manage">
          <ManageTab
            schools={this.props.records.schools}
            absenceRecords={this.props.records.absenceRecords}
          />
        </Tab>
      </Tabs>
    );
  }
}

RecordsPage.propTypes = {
  actions : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    session : state.session,
    records : state.records
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(recordsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordsPage);

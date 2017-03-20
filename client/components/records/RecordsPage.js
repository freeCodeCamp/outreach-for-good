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

  componentWillMount() {
    this.props.actions.fetchSchools();
    this.props.actions.fetchCurrentRecord();
  }

  confirm(record, date) {
    record.date = date;
    this.props.actions.postRecord(record);
  }

  changeTab(tab) {
    this.setState({ currentTab: tab });
  }

  manageRecord(schoolId) {
    this.props.actions.fetchRecordList(schoolId);
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
            current={this.props.records.current}
            schools={this.props.records.schools}
          />
        </Tab>
        <Tab
          label="Manage"
          value="manage">
          <ManageTab
            schools={this.props.records.schools}
            manageRecord={this.manageRecord.bind(this)}
            records={this.props.records.list}
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

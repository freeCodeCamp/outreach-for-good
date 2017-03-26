import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as recordsActions from '../../actions/recordsActions';
import * as schoolActions from '../../actions/schoolActions';
import {Tabs, Tab} from 'material-ui/Tabs';
import UploadTab from './components/UploadTab';
import ManageTab from './components/ManageTab';

class RecordsPage extends Component {
  constructor() {
    super();

    this.state = {
      currentTab : 'upload'
    };

    this.changeTab = this.changeTab.bind(this);
    this.confirm = this.confirm.bind(this);
    this.manageRecord = this.manageRecord.bind(this);
  }

  componentWillMount() {
    this.props.schoolActions.getAllSchools();
    this.props.recordsActions.getCurrentRecord();
  }

  confirm(record, date) {
    record.date = date;
    this.props.recordsActions.postRecord(record);
  }

  changeTab(tab) {
    this.setState({ currentTab: tab });
  }

  manageRecord(schoolId) {
    console.log('record list changed');
    this.props.recordsActions.getSchoolRecordList(schoolId);
  }

  render() {
    return (
      <Tabs
        value={this.state.currentTab}
        onChange={this.changeTab}
        >
        <Tab
          label="Upload"
          value="upload">
          <UploadTab
            confirm={this.confirm}
            current={this.props.records.current}
            schools={this.props.schools}
          />
        </Tab>
        <Tab
          label="Manage"
          value="manage">
          <ManageTab
            schools={this.props.schools}
            manageRecord={this.manageRecord}
            records={this.props.records.list}
          />
        </Tab>
      </Tabs>
    );
  }
}

RecordsPage.propTypes = {
  schoolActions  : PropTypes.object.isRequired,
  recordsActions : PropTypes.object.isRequired,
  records        : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    session : state.session,
    records : state.records,
    schools : state.schools
  };
}

function mapDispatchToProps(dispatch) {
  return {
    recordsActions : bindActionCreators(recordsActions, dispatch),
    schoolActions  : bindActionCreators(schoolActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordsPage);

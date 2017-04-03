import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchRecords, changeTab} from '../../actions/recordsActions';
import {Tabs, Tab} from 'material-ui/Tabs';
import UploadTab from './partials/UploadTab';
import ManageTab from './partials/ManageTab';
import Dimensions from 'react-dimensions';
import {
  fetchSchoolRecordList,
  addRecord,
  removeRecord} from '../../actions/absenceRecordActions';
// import * as absRecActions from '../../actions/absenceRecordActions';

class RecordsPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.changeTab = this.changeTab.bind(this);
    // this.confirm = this.confirm.bind(this);
  }

  componentWillMount() {
    this.props.action.fetchRecords();
  }

  // confirm(record, date) {
  //   record.date = date;
  //   this.props.recordsActions.postRecord(record);
  // }

  changeTab(tab) {
    this.props.action.changeTab(tab);
  }

  render() {
    return (
      <Tabs
        style={{width: this.props.containerWidth}}
        value={this.props.records.view.currentTab}
        onChange={this.changeTab}
        >
        <Tab
          label="Upload"
          value="upload">
          <UploadTab
            confirm={this.confirm}
            currentRecord={this.props.records.current}
            absenceRecords={this.props.absenceRecords}
            schools={this.props.schools}
            addRecord={this.props.action.addRecord}
          />
        </Tab>
        <Tab
          label="Manage"
          value="manage">
          <ManageTab
            view={{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            fetchSchoolRecordList={this.props.action.fetchSchoolRecordList}
            absenceRecordsList={this.props.absenceRecords}
            schools={this.props.schools}
            removeRecord={this.props.action.removeRecord}
          />
        </Tab>
      </Tabs>
    );
  }
}

RecordsPage.propTypes = {
  records : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    absenceRecords : state.absenceRecords,
    session        : state.session,
    records        : state.records,
    schools        : state.schools
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action : bindActionCreators({
      fetchRecords,
      changeTab,
      fetchSchoolRecordList,
      addRecord,
      removeRecord
    }, dispatch)
    // absRecActions : bindActionCreators(absRecActions, dispatch),
    // fetchRecords  : bindActionCreators(fetchRecords, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dimensions({elementResize: true})(RecordsPage));

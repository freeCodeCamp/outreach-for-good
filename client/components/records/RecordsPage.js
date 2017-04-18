import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchRecords, changeTab} from '../../modules/recordsReducer';
import {Tabs, Tab} from 'material-ui/Tabs';
import UploadTab from './partials/UploadTab';
import ManageTab from './partials/ManageTab';
import Dimensions from 'react-dimensions';
import { getAllSchools } from '../../modules/schoolReducer';
import {
  fetchSchoolRecordList,
  addRecord,
  removeRecord} from '../../modules/absenceRecordReducer';

class RecordsPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.changeTab = this.changeTab.bind(this);
  }

  componentWillMount() {
    this.props.actions.fetchRecords();
    this.props.actions.getAllSchools();
  }

  changeTab(tab) {
    this.props.actions.changeTab(tab);
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
            addRecord={this.props.actions.addRecord}
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
            fetchSchoolRecordList={this.props.actions.fetchSchoolRecordList}
            absenceRecordsList={this.props.absenceRecords}
            schools={this.props.schools}
            removeRecord={this.props.actions.removeRecord}
          />
        </Tab>
      </Tabs>
    );
  }
}

RecordsPage.propTypes = {
  schools        : PropTypes.object.isRequired,
  absenceRecords : PropTypes.object.isRequired,
  actions        : PropTypes.object.isRequired,
  records        : PropTypes.object.isRequired
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
    actions : bindActionCreators({
      fetchRecords,
      changeTab,
      fetchSchoolRecordList,
      addRecord,
      removeRecord,
      getAllSchools
    }, dispatch)
    // absRecActions : bindActionCreators(absRecActions, dispatch),
    // fetchRecords  : bindActionCreators(fetchRecords, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dimensions({elementResize: true})(RecordsPage));

import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as recordsActions from '../../actions/recordsActions';
import * as schoolActions from '../../actions/schoolActions';
import {Tabs, Tab} from 'material-ui/Tabs';
import UploadTab from './partials/UploadTab';
import ManageTab from './partials/ManageTab';
import Dimensions from 'react-dimensions';
import TableModel from '../../models/TableModel';
import * as absAct from '../../actions/absenceRecordActions';

const table = new TableModel();

class RecordsPage extends Component {
  constructor(props, context) {
    super(props, context);

    let nextTable = this.initializeTable();
    this.state = {
      table         : nextTable,
      currentTab    : 'upload',
      manageRecords : props.absenceRecords
    };

    this.initializeTable = this.initializeTable.bind(this);
    this.manageTabClick = this.manageTabClick.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.confirm = this.confirm.bind(this);
    this.manageRecord = this.manageRecord.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let nextTable = this.state.table;
    nextTable = table.updateSortIndex(nextTable, '');
    nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);

    this.setState({
      table : nextTable
    });
  }

  /**
   * Initialize Data Table
   *   - Retrieve and configure data for table
   *   - Set default state for 'action' variables
   */
  initializeTable() {
    let nextTable;

    //this fetches the school records list for the manage tab
    //currently hardcoded in
    //need to work out the loading order to resolve without errors
    let schoolId = '58dbbc071f99bcb70a9d0958';
    this.props.absActions.fetchSchoolRecordList(schoolId);

    nextTable = table.setSelectedTab(table, 'manage');
    return nextTable;
  }

  componentWillMount() {
    //TODO relook at these
    //which of these is unneeded
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

  manageTabClick(action, data, event) {
    let manageRecords = this.props.absenceRecords.get(data).get('entries');
    this.setState({ manageRecords });
  }

  render() {
    return (
      <Tabs
        style={{width: this.props.containerWidth}}
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
            view={{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            records={this.props.absenceRecords}
            table={this.state.table}
            schools={this.props.schools}
            manageRecords={this.state.manageRecords}
            clickHandler={this.manageTabClick}
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
    absenceRecords : state.absenceRecords,
    session        : state.session,
    records        : state.records,
    schools        : state.schools
  };
}

function mapDispatchToProps(dispatch) {
  return {
    absActions     : bindActionCreators(absAct, dispatch),
    recordsActions : bindActionCreators(recordsActions, dispatch),
    schoolActions  : bindActionCreators(schoolActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dimensions({elementResize: true})(RecordsPage));

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as absRecordActions from '../../modules/absence-record';
import * as tableActions from '../../components/data-table/data-table.actions';
import * as localActions from './dashboard.actions';
import * as localDefs from './dashboard.defs';
import * as reportActions from '../../modules/reports';
import * as settingsActions from '../../modules/settings';
import * as studentActions from '../../modules/student';
import * as userActions from '../../modules/user';

import Dimensions from 'react-dimensions-cjs';
import { Tabs } from 'material-ui/Tabs';
import { List, Map } from 'immutable';

import CsvParse from '../../components/csv-parse/csv-parse';
import { Tab } from '../../components/tab/tab';
import Report from '../../models/report';
import TableModel from '../../models/table';
import CourtTab from './tabs/court';
import HomeTab from './tabs/home';
import LetterTab from './tabs/letter';
import PhoneTab from './tabs/phone';
import SstTab from './tabs/sst';
import StudentTab from './tabs/student';

import './dashboard.scss';

const table = new TableModel();

class DashboardPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Register Initial Component State
    let nextTable = table.setSelectedTab(table, 'Student');
    nextTable = table.setFixedColumn(nextTable, 'school.name', 'student.lastName');
    nextTable = table.setGroupAggregateColumns(nextTable, ['entry.absences', 'entry.absencesDelta',
      'entry.tardies', 'entry.tardiesDelta', 'entry.present', 'entry.enrolled']);
    nextTable = this.initClickActions(nextTable);
    this.state = { table: nextTable };
  }

  componentDidMount() {
    this.retrieveData('Student');
  }

  componentDidUpdate() {
    while(this.pendingApiCalls.length) {
      this.performApiCall(this.pendingApiCalls.shift());
    }
  }

  _absenceRecords = List([]);
  pendingApiCalls = [];

  initClickActions = nextTable => {
    nextTable = table.addPopovers(nextTable, {
      [localActions.FILTER] : false,
      [localActions.EDIT]   : false,
      [localActions.TABLE]  : false
    });
    return nextTable;
  }

  /**
   * Perform API call to Retrieve Data
   *   - Retrieve and configure data for table
   *   - Set default state for 'action' variables
   */
  retrieveData = (tab, filter, tier) => {
    let loadingPromise;
    let currentTab = tab || this.state.currentTab;
    let yearFilter = filter || this.state.yearFilter;
    let tierQuery = '';
    switch (tier) {
    case localActions.TIER_1: tierQuery = 'tier=1&'; break;
    case localActions.TIER_2: tierQuery = 'tier=2&'; break;
    case localActions.TIER_3: tierQuery = 'tier=3&'; break;
    }
    switch (currentTab) {
    case 'CourtReferral':
      loadingPromise = this.props.absRecordActions.fetchRecordsListQuery('type=Court+Referral', yearFilter);
      break;
    case 'HomeVisit':
      loadingPromise = this.props.absRecordActions.fetchRecordsListQuery(`${tierQuery}type=Home+Visit`, yearFilter);
      break;
    case 'LetterSent':
      loadingPromise = this.props.absRecordActions.fetchRecordsListQuery(`${tierQuery}type=Letter+Sent`, yearFilter);
      break;
    case 'PhoneCall':
      loadingPromise = this.props.absRecordActions.fetchRecordsListQuery(`${tierQuery}type=Phone+Call`, yearFilter);
      break;
    case 'SSTReferral':
      loadingPromise = this.props.absRecordActions.fetchRecordsListQuery('type=SST+Referral', yearFilter);
      break;
    case 'Student':
      loadingPromise = this.props.absRecordActions.fetchRecordsList(yearFilter);
      break;
    }
    this.props.reportActions.getOutreachCounts('withdrawn=false');
    loadingPromise.then(() => this.updateDataTable());
    this.setState({loadResolved: false, currentTab, yearFilter});
  }

  updateDataTable = nextProps => {
    const props = nextProps || this.props;
    this._absenceRecords = props.withdrawnStudents
      ? props.absenceRecords
      : props.absenceRecords.filter(record => !record.get('student.withdrawn'));
    let nextTable = this.state.table.updateSortCol(this.state.table, '');
    nextTable = nextTable.buildIndexMap(nextTable, this._absenceRecords);
    nextTable = nextTable.enableFiltering(nextTable);
    nextTable = nextTable.collapseFixedGroups(nextTable);
    this.setState({table: nextTable, loadResolved: true});
  }

  clickHandler = (action, data, event) => {
    let nextTable;
    //let nextForm;
    switch (action) {
    // Clicked a main tab
    case 'changeTabs':
      this.handleChangeTabs(nextTable, data);
      break;
    /**
     * DataTable Click Handler
     *   - Select / de-select a table row
     *   - Sort by a column
     *   - Apply a filter
     */
    case 'toggleSelected':
      this.handleToggleSelectedRow(nextTable, data);
      break;
    case 'toggleSortCol':
      this.handleToggleSortCol(nextTable, data);
      break;
    case 'changeFilterCol':
      this.handleChangeColFilter(nextTable, data, event);
      break;
    /**
     * Button / Popover Menu Click Handler
     *   - Typically opens a <Dialog> modal or popover menu
     *   - Initialize dialog and form field parameters
     */
    case 'menuClick':
    case 'buttonClick':
      nextTable = table.setSelectedRowData(this.state.table,
        this.getSelectedRowData());
      if(data == localActions.EDIT || data == localActions.FILTER || data == localActions.TABLE) {
        this.setState({table: table.handlePopoverButtonClick(nextTable, data, event)});

      } else if(data == localActions.TOGGLE_WITHDRAWN_STUDENTS) {
        this.pendingApiCalls.push(localActions.TOGGLE_WITHDRAWN_STUDENTS);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.ALL_YEARS) {
        this.retrieveData(nextTable.get('selectedTab'));
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.Y2016_Y2017) {
        this.retrieveData(nextTable.get('selectedTab'), 'year/2016-2017');
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.Y2015_Y2016) {
        this.retrieveData(nextTable.get('selectedTab'), 'year/2015-2016');
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.IEP_ADD) {
        this.pendingApiCalls.push(localActions.IEP_ADD);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.IEP_REMOVE) {
        this.pendingApiCalls.push(localActions.IEP_REMOVE);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.CFA_ADD) {
        this.pendingApiCalls.push(localActions.CFA_ADD);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.CFA_REMOVE) {
        this.pendingApiCalls.push(localActions.CFA_REMOVE);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.WITHDRAW_ADD) {
        this.pendingApiCalls.push(localActions.WITHDRAW_ADD);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.WITHDRAW_REMOVE) {
        this.pendingApiCalls.push(localActions.WITHDRAW_REMOVE);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.EXPORT_CSV || data == localActions.EXPORT_VISIBLE_CSV) {
        this.handleExportToCSV(nextTable, data);

      } else if(data == localActions.TIER_1 || data == localActions.TIER_2
                || data == localActions.TIER_3 || data == localActions.ALL_TIERS) {
        this.handleQueryOutreachTier(nextTable, data);

      } else if(data == tableActions.SET_AGGREGATE_SUM || data == tableActions.SET_AGGREGATE_AVERAGE
                || data == tableActions.SET_AGGREGATE_MAXIMUM || data == tableActions.SET_AGGREGATE_MINIMUM) {
        this.handleChangeTableAggregate(nextTable, data);

      } else {
        this.handleInterfaceButtonClick(nextTable);
      }
      break;
    // Clicked away from popover menu
    case 'popoverClose':
      this.handleClosePopover(this.state.table);
      break;
    }
  } // End of: clickHandler()

  //ToDo: update local cache instead of re-requeting the data
  performApiCall = apiCallId => {
    let loadingPromise;
    switch (apiCallId) {
    case localActions.TOGGLE_WITHDRAWN_STUDENTS:
      loadingPromise = this.props.settingsActions.setWithdrawnStudents(!this.props.withdrawnStudents);
      break;
    case localActions.IEP_ADD:
      loadingPromise = this.putStudentIep(true).then(() => this.retrieveData());
      break;
    case localActions.IEP_REMOVE:
      loadingPromise = this.putStudentIep(false).then(() => this.retrieveData());
      break;
    case localActions.CFA_ADD:
      loadingPromise = this.putStudentCfa(true).then(() => this.retrieveData());
      break;
    case localActions.CFA_REMOVE:
      loadingPromise = this.putStudentCfa(false).then(() => this.retrieveData());
      break;
    case localActions.WITHDRAW_ADD:
      loadingPromise = this.putStudentWithdrawn(true).then(() => this.retrieveData());
      break;
    case localActions.WITHDRAW_REMOVE:
      loadingPromise = this.putStudentWithdrawn(false).then(() => this.retrieveData());
      break;
    }
    loadingPromise.then(() => this.updateDataTable());
  }

  putStudentIep = value =>
    this.props.studentActions.putStudentIep(
      this.getSelectedRowData().map(v => v.get('student._id')).toJS(), value);

  putStudentCfa = value =>
    this.props.studentActions.putStudentCfa(
      this.getSelectedRowData().map(v => v.get('student._id')).toJS(), value);

  putStudentWithdrawn = value =>
    this.props.studentActions.putStudentWithdrawn(
      this.getSelectedRowData().map(v => v.get('student._id')).toJS(), value);

  handleChangeTabs = (nextTable, data) => {
    nextTable = table.setSelectedTab(this.state.table, data.props.value);
    nextTable = this.initClickActions(nextTable);
    this.retrieveData(data.props.value);
    this.setState({table: nextTable});
  }

  handleToggleSelectedRow = (nextTable, index) => {
    nextTable = this._absenceRecords.size <= index
      ? table.toggleCollapsedRow(this.state.table, index)
      : table.toggleSelectedRowIndex(this.state.table, index);
    this.setState({table: nextTable});
  }

  handleToggleSortCol = (nextTable, data) => {
    nextTable = table.updateSortCol(this.state.table, data);
    //nextTable = table.buildIndexMap(nextTable, this.props.absenceRecords);
    nextTable = table.filterIndexMap(nextTable, this._absenceRecords);
    this.setState({table: nextTable});
  }

  handleChangeColFilter = (nextTable, data, event) => {
    nextTable = table.updateFilterBy(this.state.table, data.substr(7), event);
    nextTable = table.filterIndexMap(nextTable, this._absenceRecords);
    this.setState({table: nextTable});
  }

  handleInterfaceButtonClick = nextTable => {
    this.handleClosePopover(nextTable);
  }

  handleClosePopover = nextTable => {
    nextTable = table.resetPopovers(nextTable);
    this.setState({table: nextTable});
  }

  handleQueryOutreachTier = (nextTable, data) => {
    nextTable = table.resetPopovers(nextTable);
    data === localActions.ALL_TIERS
      ? this.retrieveData()
      : this.retrieveData(null, null, data);
    this.setState({table: nextTable});
  }

  handleChangeTableAggregate = (nextTable, data) => {
    var nextAggragate;
    switch (data) {
    case tableActions.SET_AGGREGATE_SUM: nextAggragate = 'sum'; break;
    case tableActions.SET_AGGREGATE_AVERAGE: nextAggragate = 'average'; break;
    case tableActions.SET_AGGREGATE_MAXIMUM: nextAggragate = 'maximum'; break;
    case tableActions.SET_AGGREGATE_MINIMUM: nextAggragate = 'minimum'; break;
    }
    nextTable = table.changeAggregateType(nextTable, nextAggragate);
    nextTable = table.resetPopovers(nextTable);
    nextTable = table.buildIndexMap(nextTable, this._absenceRecords);
    this.setState({table: nextTable});
  }

  handleExportToCSV = (nextTable, data) => {
    var columns = Map();
    localDefs.absenceRecordTableColumns.forEach(c => {
      // special handling for group column, shown as '+' in the table
      if(c.id == 'school.name') {
        columns = columns.set('School', c.id);
      } else {
        columns = columns.set(c.title, c.id);
      }
    });
    nextTable = table.resetPopovers(this.state.table);
    if(data == localActions.EXPORT_CSV) {
      this.setState({
        table           : nextTable,
        downloadCsvData :
          this._absenceRecords.map(record =>
            columns.map(col_id =>
              record.get(col_id)
          )).toJS(),
        downloadCsvToken : Date.now()
      });
    }
  }

  // Given a table-row index number, return object containing all row data
  getSelectedRowData = () => this._absenceRecords
      .filter((v, i) => this.state.table.get('selectedIndex')
      .indexOf(i) != -1);

  // Handle user changing main tabs
  tabHandler = data => {
    this.clickHandler('changeTabs', data);
  }

  render() {
    let viewport = {
      width  : this.props.containerWidth - 20,
      height : this.props.containerHeight - 48 - 80
    }; // Facilitates table real-time resizing
    return (
      <div>
        <Tabs
          style={{width: this.props.containerWidth}}
          value={this.state.table.get('selectedTab')}
        >
          {[{value: 'Student', class: 'fa fa-child fa-2x', Component: StudentTab},
          {value: 'PhoneCall', class: 'fa fa-phone fa-2x', Component: PhoneTab},
          {value: 'LetterSent', class: 'fa fa-envelope fa-2x', Component: LetterTab},
          {value: 'HomeVisit', class: 'fa fa-home fa-2x', Component: HomeTab},
          {value: 'SSTReferral', class: 'fa fa-support fa-2x', Component: SstTab},
          {value: 'CourtReferral', class: 'fa fa-gavel fa-2x', Component: CourtTab}
          ].map((tab, index) => <Tab
              key={`tab-${index}`}
              value={tab.value}
              iconClass={tab.class}
              onActive={this.tabHandler}
              {...this.props} >
              <tab.Component
                view = {viewport}
                absenceRecords = {this._absenceRecords}
                table = {this.state.table}
                loaded = {this.state.loadResolved}
                clickHandler = {this.clickHandler}
                tabName = {tab.value}
                withdrawnStudents = {this.props.withdrawnStudents}
              />
            </Tab>
          )}
        </Tabs>
        <CsvParse
          data={this.state.downloadCsvData}
          filename={this.state.downloadCsvFilename}
          token={this.state.downloadCsvToken}
        />
      </div>
    );
  }
}

DashboardPage.propTypes = {
  absRecordActions  : PropTypes.object.isRequired,
  reportActions     : PropTypes.object.isRequired,
  settingsActions   : PropTypes.object.isRequired,
  studentActions    : PropTypes.object.isRequired,
  userActions       : PropTypes.object.isRequired,
  absenceRecords    : PropTypes.object.isRequired,
  apiCallId         : PropTypes.string,
  containerWidth    : PropTypes.number.isRequired,
  containerHeight   : PropTypes.number.isRequired,
  reports           : PropTypes.instanceOf(Report),
  withdrawnStudents : PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    absenceRecords    : state.absenceRecords,
    reports           : state.reports,
    withdrawnStudents : state.settings.withdrawnStudents,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    absRecordActions : bindActionCreators(absRecordActions, dispatch),
    reportActions    : bindActionCreators(reportActions, dispatch),
    settingsActions  : bindActionCreators(settingsActions, dispatch),
    studentActions   : bindActionCreators(studentActions, dispatch),
    userActions      : bindActionCreators(userActions, dispatch)
  };
}

//https://github.com/digidem/react-dimensions-cjs/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(DashboardPage));

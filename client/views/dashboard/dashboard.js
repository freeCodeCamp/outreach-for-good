import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as absRecordActions from '../../modules/absence-record';
import * as localActions from './dashboard.actions';
import * as reportActions from '../../modules/reports';
import * as settingsActions from '../../modules/settings';
import * as studentActions from '../../modules/student';
import * as userActions from '../../modules/user';

import Dimensions from 'react-dimensions-cjs';
import { Tabs } from 'material-ui/Tabs';
import { List } from 'immutable';

import { Tab } from '../../components/tab/tab';
import Report from '../../models/report';
import TableModel from '../../models/table';
import CourtTab from './tabs/court';
import HomeTab from './tabs/home';
import LetterTab from './tabs/letter';
import PhoneTab from './tabs/phone';
import SstTab from './tabs/sst';
import StudentTab from './tabs/student';


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

  componentWillReceiveProps(nextProps) {
    if(nextProps.withdrawnStudents !== this.props.withdrawnStudents) {
      this.updateDataTable(nextProps);
    }
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
      [localActions.EDIT]   : false
    });
    return nextTable;
  }

  /**
   * Perform API call to Retrieve Data
   *   - Retrieve and configure data for table
   *   - Set default state for 'action' variables
   */
  retrieveData = (currentTab, yearFilter) => {
    let loadingPromise;
    switch (currentTab) {
    case 'CourtReferral':
      loadingPromise = this.props.absRecordActions.fetchRecordsListQuery('type=Court+Referral', yearFilter);
      break;
    case 'HomeVisit':
      loadingPromise = this.props.absRecordActions.fetchRecordsListQuery('type=Home+Visit', yearFilter);
      break;
    case 'LetterSent':
      loadingPromise = this.props.absRecordActions.fetchRecordsListQuery('type=Letter+Sent', yearFilter);
      break;
    case 'PhoneCall':
      loadingPromise = this.props.absRecordActions.fetchRecordsListQuery('type=Phone+Call', yearFilter);
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
    this.setState({loadResolved: false});
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

  performApiCall = apiCallId => {
    console.log('performApiCall', apiCallId);
    switch (apiCallId) {
    case localActions.TOGGLE_WITHDRAWN_STUDENTS:
      this.props.settingsActions.setWithdrawnStudents(!this.props.withdrawnStudents);
    }
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
      if(data == localActions.EDIT || data == localActions.FILTER) {
        this.handleDialogButtonClick(nextTable, data, event);

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
        this.handleIepClick(true);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.IEP_REMOVE) {
        this.handleIepClick(false);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.CFA_ADD) {
        this.handleCfaClick(true);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.CFA_REMOVE) {
        this.handleCfaClick(false);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.WITHDRAW_ADD) {
        this.handleWithdrawClick(true);
        this.handleInterfaceButtonClick(nextTable);

      } else if(data == localActions.WITHDRAW_REMOVE) {
        this.handleWithdrawClick(false);
        this.handleInterfaceButtonClick(nextTable);

      } else {
        this.handleInterfaceButtonClick(nextTable);
      }
      break;
    // Clicked away from popover menu
    case 'popoverClose':
      this.handleClosePopover(nextTable);
      break;
    }
  } // End of: clickHandler()

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

  handleDialogButtonClick = (nextTable, data, event) => {
    nextTable = table.togglePopovers(nextTable, data);
    nextTable = table.setAnchor(nextTable, event.currentTarget);
    nextTable = table.resetDialogs(nextTable);
    this.setState({table: nextTable});
  }

  handleInterfaceButtonClick = nextTable => {
    nextTable = table.resetPopovers(this.state.table);
    this.setState({table: nextTable});
  }

  handleClosePopover = nextTable => {
    nextTable = table.resetPopovers(this.state.table);
    this.setState({table: nextTable});
  }

  handleIepClick = value => {
    this.props.studentActions.putStudentIep(
      this.getSelectedRowData().map(v => v.get('student._id')).toJS(), value
    );
  }

  handleCfaClick = value => {
    this.props.studentActions.putStudentCfa(
      this.getSelectedRowData().map(v => v.get('student._id')).toJS(), value
    );
  }

  handleWithdrawClick = value => {
    this.props.studentActions.putStudentWithdrawn(
      this.getSelectedRowData().map(v => v.get('student._id')).toJS(), value
    );
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
    }; // Facillitates table realtime resizing
    return (
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

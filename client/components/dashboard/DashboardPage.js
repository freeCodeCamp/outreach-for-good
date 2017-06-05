import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {Tabs} from 'material-ui/Tabs';
import Tab from './partials/Tab';
import Dimensions from 'react-dimensions-cjs';

import * as absAct from '../../modules/absenceRecordReducer';
import * as repAct from '../../modules/reportsReducer';
import * as usrAct from '../../modules/userReducer';
import * as locAct from './partials/localActions';
import TableModel from '../../models/TableModel';
import Report from '../../models/ReportModel';

import CourtTab from './CourtTab';
import HomeTab from './HomeTab';
import LetterTab from './LetterTab';
import PhoneTab from './PhoneTab';
import SstTab from './SstTab';
import StudentTab from './StudentTab';


const table = new TableModel();

class DashboardPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Register Initial Component State
    let nextTable = table.setSelectedTab(table, 'Student');
    nextTable = this.initClickActions(nextTable);
    this.state = { table: nextTable };
  }

  componentDidMount() {
    this.retrieveData('Student');
  }

  initClickActions = nextTable => {
    nextTable = table.addPopovers(nextTable, {
      [locAct.FILTER] : false,
      [locAct.EDIT]   : false
    });
    nextTable = table.addDialogs(nextTable, {
      [locAct.WITHDRAW_STUDENT] : false,
      [locAct.ENROLL_STUDENT]   : false
    });
    return nextTable;
  }

  initClickActions = nextTable => {
    nextTable = table.addPopovers(nextTable, {
      [locAct.FILTER] : false,
      [locAct.EDIT]   : false
    });
    nextTable = table.addDialogs(nextTable, {
      [locAct.WITHDRAW_STUDENT] : false,
      [locAct.ENROLL_STUDENT]   : false
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
      loadingPromise = this.props.absAct.fetchRecordsListQuery('type=Court+Referral', yearFilter);
      break;
    case 'HomeVisit':
      loadingPromise = this.props.absAct.fetchRecordsListQuery('type=Home+Visit', yearFilter);
      break;
    case 'LetterSent':
      loadingPromise = this.props.absAct.fetchRecordsListQuery('type=Letter+Sent', yearFilter);
      break;
    case 'PhoneCall':
      loadingPromise = this.props.absAct.fetchRecordsListQuery('type=Phone+Call', yearFilter);
      break;
    case 'SSTReferral':
      loadingPromise = this.props.absAct.fetchRecordsListQuery('type=SST+Referral', yearFilter);
      break;
    case 'Student':
      loadingPromise = this.props.absAct.fetchRecordsList(yearFilter);
      this.props.repAct.getOutreachCounts('withdrawn=false');
      break;
    }
    loadingPromise.then(() => this.updateDataTable());
    this.setState({loadResolved: false});
  }

  updateDataTable = () => {
    let nextTable = table.updateSortCol(this.state.table, '');
    nextTable = table.buildIndexMap(nextTable, this.props.absenceRecords);
    nextTable = table.enableFiltering(nextTable);
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
      if(data == locAct.EDIT || data == locAct.FILTER) {
        this.handleDialogButtonClick(nextTable, data, event);
      } else if(data == locAct.ALL_YEARS) {
        this.retrieveData(nextTable.get('selectedTab'));
        this.handleInterfaceButtonClick(nextTable, data, event);
      } else if(data == locAct.Y2016_Y2017) {
        this.retrieveData(nextTable.get('selectedTab'), 'year/2016-2017');
        this.handleInterfaceButtonClick(nextTable, data, event);
      } else if(data == locAct.Y2015_Y2016) {
        this.retrieveData(nextTable.get('selectedTab'), 'year/2015-2016');
        this.handleInterfaceButtonClick(nextTable, data, event);
      } else {
        this.handleInterfaceButtonClick(nextTable, data, event);
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

  handleToggleSelectedRow = (nextTable, data) => {
    nextTable = table.toggleSelectedRowIndex(this.state.table, data);
    this.setState({table: nextTable});
  }

  handleToggleSortCol = (nextTable, data) => {
    nextTable = table.updateSortCol(this.state.table, data);
    nextTable = table.sortIndexMap(nextTable, this.props.absenceRecords);
    this.setState({table: nextTable});
  }

  handleChangeColFilter = (nextTable, data, event) => {
    //console.log(data.substr(7), event);
    let tabData = this.state.table.get('selectedTab') == 'users'
        ? this.props.absenceRecords : this.props.absenceRecords;
    nextTable = table.updateFilterBy(this.state.table, tabData, data.substr(7), event);
    nextTable = table.sortIndexMap(nextTable, tabData);
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

  // Given a table-row index number, return object containing all row data
  getSelectedRowData = () => this.props.absenceRecords
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
        <Tab
          value='Student'
          iconClass='fa fa-child fa-2x'
          onActive={this.tabHandler}
          {...this.props}
        >
          <StudentTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loadResolved}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          value='PhoneCall'
          iconClass='fa fa-phone fa-2x'
          onActive={this.tabHandler}
          {...this.props}
        >
          <PhoneTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loadResolved}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          value='LetterSent'
          iconClass='fa fa-envelope fa-2x'
          onActive={this.tabHandler}
          {...this.props}
        >
          <LetterTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loadResolved}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          value='HomeVisit'
          iconClass='fa fa-home fa-2x'
          onActive={this.tabHandler}
          {...this.props}
        >
          <HomeTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loadResolved}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          value='SSTReferral'
          iconClass='fa fa-support fa-2x'
          onActive={this.tabHandler}
          {...this.props}
        >
          <SstTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loadResolved}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          value='CourtReferral'
          iconClass='fa fa-gavel fa-2x'
          onActive={this.tabHandler}
          {...this.props}
        >
          <CourtTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loadResolved}
            clickHandler = {this.clickHandler}
          />
        </Tab>
      </Tabs>
    );
  }
}

DashboardPage.propTypes = {
  absAct          : PropTypes.object.isRequired,
  repAct          : PropTypes.object.isRequired,
  usrAct          : PropTypes.object.isRequired,
  absenceRecords  : PropTypes.object.isRequired,
  containerWidth  : PropTypes.number.isRequired,
  containerHeight : PropTypes.number.isRequired,
  reports         : PropTypes.instanceOf(Report)
};

function mapStateToProps(state) {
  return {
    absenceRecords : state.absenceRecords,
    reports        : state.reports,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    absAct : bindActionCreators(absAct, dispatch),
    repAct : bindActionCreators(repAct, dispatch),
    usrAct : bindActionCreators(usrAct, dispatch)
  };
}

//https://github.com/digidem/react-dimensions-cjs/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(DashboardPage));

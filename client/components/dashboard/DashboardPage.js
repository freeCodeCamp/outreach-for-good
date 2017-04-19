import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dimensions from 'react-dimensions';

import * as absAct from '../../modules/absenceRecordReducer';
import * as repAct from '../../modules/reportsReducer';
import * as usrAct from '../../modules/userReducer';
import * as locAct from './localActions';
import TableModel from '../../models/TableModel';
import Report from '../../models/ReportModel';

import CourtTab from './CourtTab';
import HomeTab from './HomeTab';
import LetterTab from './LetterTab';
import PhoneTab from './PhoneTab';
import SstTab from './SstTab';
import StudentTab from './StudentTab';

import Badge from 'material-ui/Badge';

const table = new TableModel();
const badgeStyle = {
  top          : 15,
  right        : -10,
  height       : 20,
  borderRadius : 6,
  width        : 'auto',
  paddingRight : 4,
  paddingLeft  : 4,
};

class DashboardPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Register Initial Component State
    let nextTable = table.setSelectedTab(table, 'student');
    nextTable = this.initClickActions(nextTable);
    this.state = { table: nextTable, loaded: false };

    this.retrieveData = this.retrieveData.bind(this);
    this.initClickActions = this.initClickActions.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
  }

  componentDidMount() {
    this.retrieveData('student');
  }

  componentWillReceiveProps(nextProps) {
    let nextTable = this.state.table;
    let dataLoaded = false;
    switch (nextTable.get('selectedTab')) {
    case 'court':
      if(nextProps.absenceRecords.size && !this.state.loaded) {
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      }
      break;
    case 'home':
      if(nextProps.absenceRecords.size && !this.state.loaded) {
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      }
      break;
    case 'letter':
      if(nextProps.absenceRecords.size && !this.state.loaded) {
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      }
      break;
    case 'phone':
      if(nextProps.absenceRecords.size && !this.state.loaded) {
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      }
      break;
    case 'sst':
      if(nextProps.absenceRecords.size && !this.state.loaded) {
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      }
      break;
    case 'student':
      if(nextProps.absenceRecords.size && !this.state.loaded) {
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      }
      break;
    }
    if(dataLoaded) {
      nextTable = table.enableFiltering(nextTable);
      this.setState({table: nextTable, loaded: true});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let selectedTab = this.state.table.get('selectedTab');
    if(prevState.table.get('selectedTab') != selectedTab) {
      this.retrieveData(selectedTab);
    }
  }

  /**
   * Perform API call to Retrieve Data
   *   - Retrieve and configure data for table
   *   - Set default state for 'action' variables
   */
  retrieveData(currentTab) {
    switch (currentTab) {
    case 'court':
      this.props.absAct.fetchRecordsListQuery('type=Court+Referral');
      break;
    case 'home':
      this.props.absAct.fetchRecordsListQuery('type=Home+Visit');
      break;
    case 'letter':
      this.props.absAct.fetchRecordsListQuery('type=Letter+Sent');
      break;
    case 'phone':
      this.props.absAct.fetchRecordsListQuery('type=Phone+Call');
      break;
    case 'sst':
      this.props.absAct.fetchRecordsListQuery('type=SST+Referral');
      break;
    case 'student':
      this.props.absAct.fetchRecordsList();
      this.props.repAct.getOutreachCounts('withdrawn=false');
      break;
    }
    //nextTable = table.enableFiltering(nextTable);
  }

  /**
   * Initialize Click Actions (on tab change)
   */
  initClickActions(nextTable) {
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

  clickHandler(action, data, event) {
    let nextTable;
    //let nextForm;
    switch (action) {

    // Clicked a main tab
    case 'changeTabs':
      nextTable = table.setSelectedTab(this.state.table, data.props.value);
      nextTable = this.initClickActions(nextTable);
      this.setState({table: nextTable, loaded: false});
      break;

    /**
     * DataTable Click Handler
     *   - Select / de-select a table row
     *   - Sort by a column
     *   - Apply a filter
     */
    case 'toggleSelected':
      nextTable = table.toggleSelectedRowIndex(this.state.table, data);
      this.setState({table: nextTable});
      break;
    case 'toggleSortCol':
      nextTable = table.updateSortCol(this.state.table, data);
      nextTable = table.sortIndexMap(nextTable, this.props.absenceRecords);
      this.setState({table: nextTable});
      break;
    case 'changeFilterCol':
      //console.log(data.substr(7), event);
      let tabData = this.state.table.get('selectedTab') == 'users'
          ? this.props.absenceRecords : this.props.absenceRecords;
      nextTable = table.updateFilterBy(this.state.table, tabData, data.substr(7), event);
      nextTable = table.sortIndexMap(nextTable, tabData);
      this.setState({table: nextTable});
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
        nextTable = table.togglePopovers(nextTable, data);
        nextTable = table.setAnchor(nextTable, event.currentTarget);
        nextTable = table.resetDialogs(nextTable);
      }
      this.setState({table: nextTable});
      break; // End of: case 'menuClick' or 'buttonClick'

    // Clicked away from popover menu
    case 'popoverClose':
      nextTable = table.resetPopovers(this.state.table);
      this.setState({table: nextTable});
      break;
    }
  }

  // Handle user changing main tabs
  tabHandler(data) {
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
          label={<i className="fa fa-child fa-2x" />}
          onActive={this.tabHandler}
          value='student'
        >
          <StudentTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loaded}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={
          this.props.reports.get('outreachCounts').get('PhoneCall')
          && <Badge
            badgeContent={this.props.reports
              .get('outreachCounts').get('PhoneCall') || ''}
            badgeStyle={badgeStyle}
            secondary
          >
            <i className="fa fa-phone fa-2x" />
          </Badge>
          || <i className="fa fa-phone fa-2x" />
          }
          onActive={this.tabHandler}
          value='phone'
        >
          <PhoneTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loaded}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={
          this.props.reports.get('outreachCounts').get('LetterSent')
          && <Badge
            badgeContent={this.props.reports
              .get('outreachCounts').get('LetterSent') || ''}
            badgeStyle={badgeStyle}
            secondary
          >
            <i className="fa fa-envelope fa-2x" />
          </Badge>
          || <i className="fa fa-envelope fa-2x" />
          }
          onActive={this.tabHandler}
          value='letter'
        >
          <LetterTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loaded}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={
          this.props.reports.get('outreachCounts').get('HomeVisit')
          && <Badge
            badgeContent={this.props.reports
              .get('outreachCounts').get('HomeVisit') || ''}
            badgeStyle={badgeStyle}
            secondary
          >
            <i className="fa fa-home fa-2x" />
          </Badge>
          || <i className="fa fa-home fa-2x" />
          }
          onActive={this.tabHandler}
          value='home'
        >
          <HomeTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loaded}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={
          this.props.reports.get('outreachCounts').get('SSTReferral')
          && <Badge
            badgeContent={this.props.reports
              .get('outreachCounts').get('SSTReferral') || ''}
            badgeStyle={badgeStyle}
            secondary
          >
            <i className="fa fa-support fa-2x" />
          </Badge>
          || <i className="fa fa-support fa-2x" />
          }
          onActive={this.tabHandler}
          value='sst'
        >
          <SstTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loaded}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={
          this.props.reports.get('outreachCounts').get('CourtReferral')
          && <Badge
            badgeContent={this.props.reports
              .get('outreachCounts').get('CourtReferral') || ''}
            badgeStyle={badgeStyle}
            secondary
          >
            <i className="fa fa-gavel fa-2x" />
          </Badge>
          || <i className="fa fa-gavel fa-2x" />
          }
          onActive={this.tabHandler}
          value='court'
        >
          <CourtTab
            view = {viewport}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
            loaded = {this.state.loaded}
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

//https://github.com/digidem/react-dimensions/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(DashboardPage));

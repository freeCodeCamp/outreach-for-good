import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dimensions from 'react-dimensions';

import * as usrAct from '../../actions/userActions';
import * as absAct from '../../actions/absenceRecordActions';
import * as repAct from '../../actions/reportsActions';
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
    let nextTable = this.initializeTable('student');
    this.state = Object.assign({ table: nextTable });

    this.initializeTable = this.initializeTable.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let nextTable = this.state.table;
    switch (nextTable.get('selectedTab')) {
    case 'court':
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      break;
    case 'home':
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      break;
    case 'letter':
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      break;
    case 'phone':
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      break;
    case 'sst':
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      break;
    case 'student':
      nextTable = table.setSelectedTab(table, 'student');
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
      break;
    }
    nextTable = table.enableFiltering(nextTable);
    this.setState({
      table : nextTable
    });
  }

  /**
   * Initialize Data Table
   *   - Retrieve and configure data for table
   *   - Set default state for 'action' variables
   */
  initializeTable(currentTab) {
    let nextTable;
    switch (currentTab) {
    case 'court':
      nextTable = table.setSelectedTab(table, 'court');
      break;
    case 'home':
      nextTable = table.setSelectedTab(table, 'home');
      break;
    case 'letter':
      nextTable = table.setSelectedTab(table, 'letter');
      break;
    case 'phone':
      nextTable = table.setSelectedTab(table, 'phone');
      break;
    case 'sst':
      nextTable = table.setSelectedTab(table, 'sst');
      break;
    case 'student':
      this.props.absAct.fetchRecordsList();
      this.props.repAct.getOutreachCounts('withdrawn=false');
      nextTable = table.setSelectedTab(table, 'student');
      break;
    }
    nextTable = table.enableFiltering(nextTable);
    return nextTable;
  }

  clickHandler(action, data, event) {
    let nextTable;
    //let nextForm;
    switch (action) {

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
    }
  }

  // Handle user changing main tabs
  tabHandler(data) {
    this.clickHandler('changeTabs', data);
  }

  render() {
    return (
      <Tabs
        style={{width: this.props.containerWidth}}
      >
        <Tab label={<i className="fa fa-child fa-2x" />}>
          <StudentTab
            view = {{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
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
          }>
          <PhoneTab
            view = {{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
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
          }>
          <LetterTab
            view = {{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
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
          }>
          <HomeTab
            view = {{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
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
          }>
          <SstTab
            view = {{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
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
          }>
          <CourtTab
            view = {{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            absenceRecords = {this.props.absenceRecords}
            table = {this.state.table}
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

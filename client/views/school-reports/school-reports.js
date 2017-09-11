import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as reportAct from '../../modules/reports';
import * as tableActions from '../../components/data-table/data-table.actions';
import * as localActions from './school-reports.actions';
import * as localDefs from './school-reports.defs';
import * as dashboardDefs from '../dashboard/dashboard.defs';
import * as settingsActions from '../../modules/settings';

import Dimensions from 'react-dimensions-cjs';
import { List, Map } from 'immutable';
import {Tabs, Tab} from 'material-ui/Tabs';

import AtRiskTab from './tabs/at-risk';
import ChronicallyAbsentTab from './tabs/chronically-absent';
import InterventionsTab from './tabs/interventions';
import OutreachesTab from './tabs/outreaches';
import TableModel from '../../models/table';

import CsvParse from '../../components/csv-parse/csv-parse';

const table = new TableModel();

class SchoolReportsPage extends React.Component {
  constructor(props) {
    super(props);

    // Register Initial Component State
    let nextTable = table.setSelectedTab(table, 'atRisk');
    nextTable = table.setFixedColumn(nextTable, 'school.name', 'student.lastName');
    nextTable = table.setGroupAggregateColumns(nextTable, ['PhoneCall.count', 'LetterSent.count',
      'HomeVisit.count', 'SSTReferral.count', 'CourtReferral.count', 'total.count']);
    nextTable = this.initClickActions(nextTable);
    this.state = {table: nextTable};
  }

  componentDidMount() {
    this.retrieveData('atRisk');
  }

  componentDidUpdate() {
    while(this.pendingApiCalls.length) {
      this.performApiCall(this.pendingApiCalls.shift());
    }
  }

  _reports = List([]);
  pendingApiCalls = [];

  initClickActions = nextTable => {
    nextTable = table.addPopovers(nextTable, {
      [localActions.FILTER] : false,
      [localActions.TABLE]  : false
    });
    return nextTable;
  }

  /**
   * Perform API call to Retrieve Data
   *   - Retrieve and configure data for table
   *   - Set default state for 'action' variables
   */
  retrieveData = tab => {
    let loadingPromise;
    let currentTab = tab || this.state.currentTab;
    // Clear previously loaded reports from the store
    //this.props.reportAct.resetReports();
    // Call the API for new reports
    switch (currentTab) {
    case 'atRisk':
      loadingPromise = this.props.reportAct.getCurrentAtRisk();
      break;
    case 'chronicAbsent':
      loadingPromise = this.props.reportAct.getChronicallyAbsent();
      break;
    case 'outreachSummary':
      loadingPromise = this.props.reportAct.getOutreachSummary();
      break;
    case 'interventionSummary':
      loadingPromise = this.props.reportAct.getInterventionSummary();
      break;
    }
    loadingPromise.then(() => this.updateData());
    this.setState({loadResolved: false, currentTab});
  }

  updateData = nextProps => {
    const props = nextProps || this.props;
    let dataSource = null;
    switch (this.state.table.get('selectedTab')) {
    case 'atRisk': dataSource = props.reports.get('atRisk'); break;
    case 'chronicAbsent': dataSource = props.reports.get('chronicAbsent'); break;
    case 'outreachSummary':dataSource = props.reports.get('outreachSummary'); break;
    case 'interventionSummary': dataSource = props.reports.get('interventionSummary'); break;
    }
    this._reports = props.withdrawnStudents ? dataSource : dataSource.filter(record => !record.get('student.withdrawn'));
    let nextTable = this.state.table.updateSortCol(this.state.table, '');
    nextTable = nextTable.buildIndexMap(nextTable, this._reports);
    nextTable = nextTable.enableFiltering(nextTable);
    nextTable = nextTable.collapseFixedGroups(nextTable);
    this.setState({table: nextTable, loadResolved: true});
  }

  clickHandler = (action, data, event) => {
    let nextTable;
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
      if(data == localActions.FILTER || data == localActions.TABLE) {
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

      } else if(data == localActions.EXPORT_CSV || data == localActions.EXPORT_VISIBLE_CSV) {
        this.handleExportToCSV(nextTable, data);

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
    }
    loadingPromise.then(() => this.updateData());
  }

  handleChangeTabs = (nextTable, data) => {
    //this.props.reportAct.resetReports();
    nextTable = table.setSelectedTab(this.state.table, data.props.value);
    nextTable = this.initClickActions(nextTable);
    this.retrieveData(data.props.value);
    this.setState({table: nextTable});
  }

  handleToggleSelectedRow = (nextTable, index) => {
    nextTable = this._reports.size <= index
      ? table.toggleCollapsedRow(this.state.table, index)
      : table.toggleSelectedRowIndex(this.state.table, index);
    this.setState({table: nextTable});
  }

  handleToggleSortCol = (nextTable, data) => {
    nextTable = table.updateSortCol(this.state.table, data);
    //nextTable = table.buildIndexMap(nextTable, this.props.absenceRecords);
    nextTable = table.filterIndexMap(nextTable, this._reports);
    this.setState({table: nextTable});
  }

  handleChangeColFilter = (nextTable, data, event) => {
    nextTable = table.updateFilterBy(this.state.table, data.substr(7), event);
    nextTable = table.filterIndexMap(nextTable, this._reports);
    this.setState({table: nextTable});
  }

  handleInterfaceButtonClick = nextTable => {
    this.handleClosePopover(nextTable);
  }

  handleClosePopover = nextTable => {
    nextTable = table.resetPopovers(nextTable);
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
    nextTable = table.buildIndexMap(nextTable, this._reports);
    this.setState({table: nextTable});
  }

  handleExportToCSV = (nextTable, data) => {
    var columns = Map();
    var columnDefs = null;
    switch (this.state.table.get('selectedTab')) {
    case 'atRisk':
    case 'chronicAbsent': columnDefs = dashboardDefs.absenceRecordTableColumns; break;
    case 'outreachSummary': columnDefs = localDefs.outreachTableColumns; break;
  }
  console.log(columnDefs);
    columnDefs.forEach(c => {
      // special handling for group column, shown as '+' in the table
      if(c.id == 'school.name') {
        columns = columns.set('School', c.id);
      } else {
        columns = columns.set(c.title, c.id);
      }
    });
    nextTable = table.resetPopovers(this.state.table);
    console.log(this._reports.toJS())
    console.log(this._reports.map(record =>
            columns.map(col_id =>
              record.get(col_id)
          )).toJS());
    if(data == localActions.EXPORT_CSV) {
      this.setState({
        table           : nextTable,
        downloadCsvData :
          this._reports.map(record =>
            columns.map(col_id =>
              record.get(col_id)
          )).toJS(),
        downloadCsvToken : Date.now()
      });
    }
  }

  // Given a table-row index number, return object containing all row data
  getSelectedRowData = () => this._reports
      .filter((v, i) => this.state.table.get('selectedIndex')
      .indexOf(i) != -1);

  // Handle user changing main tabs
  tabHandler = data => {
    this.setState({ currentTab: data });
    this.clickHandler('changeTabs', data);
  }

  render() {
    let viewport = {
      width  : this.props.containerWidth - 20,
      height : this.props.containerHeight - 48 - 80
    };

    return (
      <div>
        <Tabs
          style={{width: this.props.containerWidth}}
          value={this.state.table.get('selectedTab')}
        >
          {[{label: 'At Risk', value: 'atRisk', Component: AtRiskTab, tabData: this.props.reports.atRisk},
          {label: 'Chronically Absent', value: 'chronicAbsent', Component: ChronicallyAbsentTab, tabData: this.props.reports.chronicAbsent},
          {label: 'Outreaches', value: 'outreachSummary', Component: OutreachesTab, tabData: this.props.reports.outreachSummary},
          {label: 'Interventions', value: 'interventionSummary', Component: InterventionsTab, tabData: this.props.reports.interventionSummary},
          ].map((tab, index) => <Tab
              key={`tab-${index}`}
              value={tab.value}
              label={tab.label}
              onActive={this.tabHandler}>
              <tab.Component
                view = {viewport}
                tabData = {this._reports}
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

SchoolReportsPage.propTypes = {
  reportAct         : PropTypes.object.isRequired,
  settingsActions   : PropTypes.object.isRequired,
  reports           : PropTypes.object.isRequired,
  containerWidth    : PropTypes.number.isRequired,
  containerHeight   : PropTypes.number.isRequired,
  withdrawnStudents : PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    reports           : state.reports,
    withdrawnStudents : state.settings.withdrawnStudents,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    reportAct       : bindActionCreators(reportAct, dispatch),
    settingsActions : bindActionCreators(settingsActions, dispatch)
  };
}

//https://github.com/digidem/react-dimensions-cjs/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(SchoolReportsPage));

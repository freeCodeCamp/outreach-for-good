import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as reportAct from '../../modules/reports';
import * as localActions from './school-reports.actions';

import Dimensions from 'react-dimensions-cjs';
import { List } from 'immutable';
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
    nextTable = table.setGroupAggregateColumns(nextTable, ['entry.absences', 'entry.absencesDelta',
      'entry.tardies', 'entry.tardiesDelta', 'entry.present', 'entry.enrolled']);
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
      this.props.reportAct.resetReports();
      nextTable = table.setSelectedTab(this.state.table, data.props.value);
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
      nextTable = table.sortDataByCol(nextTable, this._reports);
      this.setState({table: nextTable});
      break;
    case 'changeFilterCol':
      let tabData = this.state.table.get('selectedTab') == 'users'
          ? this.props.absenceRecords : this.props.absenceRecords;
      nextTable = table.updateFilterBy(this.state.table, data.substr(7), event);
      nextTable = table.sortDataByCol(nextTable, tabData);
      this.setState({table: nextTable});
      break;
    case 'buttonClick':
      break;
    }
  }

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
    reportAct : bindActionCreators(reportAct, dispatch)
  };
}

//https://github.com/digidem/react-dimensions-cjs/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(SchoolReportsPage));

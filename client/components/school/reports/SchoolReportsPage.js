import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import { List } from 'immutable';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dimensions from 'react-dimensions';

import * as repAct from '../../../actions/reportsActions';
import TableModel from '../../../models/TableModel';

import AtRiskTab from './partials/AtRiskTab';
import ChronicallyAbsentTab from './partials/ChronicallyAbsentTab';
import OutreachesTab from './partials/OutreachesTab';
import InterventionsTab from './partials/InterventionsTab';

const table = new TableModel();

class SchoolReportsPage extends Component {
  constructor(props) {
    super(props);

    // Register Initial Component State
    let nextTable = this.initializeTable('atRisk');
    this.state = { table: nextTable };

    this.initializeTable = this.initializeTable.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let nextTable = this.state.table;
    switch (nextTable.get('selectedTab')) {
    case 'atRisk':
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.reports.atRisk);
      break;
    case 'chronicallyAbsent':
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.reports.chronic);
      break;
    case 'outreaches':
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.reports.outreachSummary);
      break;
    case 'interventions':
      nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.reports.interventionSummary);
      break;
    }
    // nextTable = table.enableFiltering(nextTable);
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
    nextTable = table.setSelectedTab(table, currentTab);
    switch (currentTab) {
    case 'atRisk':
      this.props.repAct.getCurrentAtRisk();
      break;
    case 'chronicallyAbsent':
      this.props.repAct.getChronicallyAbsent();
      break;
    case 'outreaches':
      this.props.repAct.getOutreachSummary();
      break;
    case 'interventions':
      this.props.repAct.getInterventionSummary();
      break;
    }
    nextTable = table.setSelectedTab(table, currentTab);
//    nextTable = table.enableFiltering(nextTable);
    return nextTable;
  }

  clickHandler(action, data, event) {
    let nextTable;
    switch (action) {

    // Clicked a main tab
    case 'changeTabs':
      nextTable = this.initializeTable(data.props.value);
      this.setState({table: nextTable});
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
    }
  }

  // Handle user changing main tabs
  tabHandler(data) {
    this.clickHandler('changeTabs', data);
  }

  render() {
    let view = {
      width  : this.props.containerWidth - 20,
      height : this.props.containerHeight - 48 - 80
    };

    return (
      <Tabs
        style={{width: this.props.containerWidth}}
        value={this.state.table.get('selectedTab')}
      >
        <Tab
          label="At Risk"
          onActive={this.tabHandler}
          value='atRisk'
        >
          <AtRiskTab
            view={view}
            atRisk={this.props.reports.atRisk}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          label="Chronically Absent"
          onActive={this.tabHandler}
          value='chronicallyAbsent'
        >
          <ChronicallyAbsentTab
            view={view}
            chronic={this.props.reports.chronicAbsent}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          label="Outreaches"
          onActive={this.tabHandler}
          value='outreaches'
        >
          <OutreachesTab
            view = {view}
            outreaches = {this.props.reports.outreachSummary}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          label="Interventions"
          onActive={this.tabHandler}
          value='interventions'
        >
          <InterventionsTab
            view={view}
            interventions = {this.props.reports.interventionSummary}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
      </Tabs>
    );
  }
}

SchoolReportsPage.propTypes = {
  repAct          : PropTypes.object.isRequired,
  absenceRecords  : PropTypes.object.isRequired,
  reports         : PropTypes.object.isRequired,
  containerWidth  : PropTypes.number.isRequired,
  containerHeight : PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    absenceRecords : state.absenceRecords,
    reports        : state.reports
  };
}

function mapDispatchToProps(dispatch) {
  return {
    repAct : bindActionCreators(repAct, dispatch)
  };
}

//https://github.com/digidem/react-dimensions/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(SchoolReportsPage));

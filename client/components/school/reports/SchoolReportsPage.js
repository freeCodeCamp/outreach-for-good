import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
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
    // let nextTable = this.initializeTable('atRisk');
    this.state = {
      // table : nextTable,
      tab : 'atRisk'
    };

    this.initializeTable = this.initializeTable.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
  }

  componentWillMount() {
    this.props.repAct.getCurrentAtRisk();
    // this.props.repAct.getChronicallyAbsent();
    // this.props.repAct.getInterventionSummary();
    // this.props.repAct.getOutreachSummary();
  }

  componentWillReceiveProps(nextProps) {
    let nextTable;

    switch (this.state.tab) {
    case 'atRisk':
      nextTable = this.initializeTable(this.state.tab);
      // nextTable = table.updateSortCol(nextTable, '');
      // nextTable = table.buildIndexMap(nextTable, nextProps.reports.atRisk);
      break;
    case 'chronicallyAbsent':
      nextTable = this.initializeTable(this.state.tab);
      // nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.reports.chronic);
      break;
    case 'outreaches':
      nextTable = this.initializeTable(this.state.tab);
      // nextTable = table.updateSortCol(nextTable, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.reports.outreachSummary);
      break;
    case 'interventions':
      nextTable = this.initializeTable(this.state.tab);
      // nextTable = table.updateSortCol(nextTable, '');
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
    // switch (currentTab) {
    // case 'atRisk':
    //   console.log('at risk');
    //   this.props.actions.getCurrentAtRisk();
    //   // nextTable = table.setSelectedTab(table, 'atRisk');
    //   break;
    // case 'chronicallyAbsent':
    //   this.props.actions.getChronicallyAbsent();
    //   nextTable = table.setSelectedTab(table, 'chronicallyAbsent');
    //   break;
    // case 'outreaches':
    //   this.props.actions.getOutreachSummary();
    //   nextTable = table.setSelectedTab(table, 'outreaches');
    //   break;
    // case 'interventions':
    //   this.props.actions.getInterventionSummary();
    //   nextTable = table.setSelectedTab(table, 'interventions');
    //   break;
    // }
    // nextTable = table.enableFiltering(nextTable);
    return nextTable;
  }

  clickHandler(action, data, event) {
    let nextTable;
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
  tabHandler(tab) {
    this.setState({ tab });
  }

  render() {
    let view = {
      width  : this.props.containerWidth - 20,
      height : this.props.containerHeight - 48 - 80
    };

    return (
      <Tabs
        style={{width: this.props.containerWidth}}
        onChange={this.tabHandler}
      >
        <Tab label="At Risk">
          {this.state.table
            && <AtRiskTab
            view={view}
            atRisk={this.props.reports.atRisk}
            table = {this.state.table}
            clickHandler = {this.clickHandler} />}
        </Tab>
        <Tab label="Chronically Absent">
          {this.state.table
            && <ChronicallyAbsentTab
            view={view}
            chronic={this.props.reports.chronic}
            table = {this.state.table}
            clickHandler = {this.clickHandler} />}
        </Tab>
        <Tab label="Outreaches">
          {this.state.table
            && <OutreachesTab
            view = {view}
            outreaches = {this.props.reports.outreachSummary}
            table = {this.state.table}
            clickHandler = {this.clickHandler} />}
        </Tab>
        <Tab label="Interventions">
          {this.state.table
            && <InterventionsTab
            view={view}
            interventions = {this.props.reports.interventionSummary}
            table = {this.state.table}
            clickHandler = {this.clickHandler} />}
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

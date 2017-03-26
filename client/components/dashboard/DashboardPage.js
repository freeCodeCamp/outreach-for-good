import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dimensions from 'react-dimensions';

import * as usrAct from '../../actions/userActions';
import * as absAct from '../../actions/absenceRecordActions';
import TableModel from '../../models/TableModel';

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
    let nextTable = this.initializeTable('student');
    this.state = Object.assign({ table: nextTable });

    this.initializeTable = this.initializeTable.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      table : this.state.table,
      form  : this.state.form
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
      nextTable = table.setSelectedTab(table, 'student');
      break;
    }
    return nextTable;
  }

  clickHandler(action, data, event) {
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
        <Tab label={<i className="fa fa-phone fa-2x" />}>
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
        <Tab label={<i className="fa fa-envelope fa-2x" />}>
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
        <Tab label={<i className="fa fa-home fa-2x" />}>
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
        <Tab label={<i className="fa fa-support fa-2x" />}>
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
        <Tab label={<i className="fa fa-gavel fa-2x" />}>
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
  usrAct          : PropTypes.object.isRequired,
  absenceRecords  : PropTypes.object.isRequired,
  containerWidth  : PropTypes.number.isRequired,
  containerHeight : PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    absenceRecords : state.absenceRecords
  };
}

function mapDispatchToProps(dispatch) {
  return {
    absAct : bindActionCreators(absAct, dispatch),
    usrAct : bindActionCreators(usrAct, dispatch)
  };
}

//https://github.com/digidem/react-dimensions/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(DashboardPage));

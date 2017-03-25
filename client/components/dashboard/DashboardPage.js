import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dimensions from 'react-dimensions';

import * as usrAct from '../../actions/userActions';
import * as schAct from '../../actions/schoolActions';
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
    let nextTable = this.initializeTable('users');
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
    case 'users':

      nextTable = table.setSelectedTab(table, 'users');
      break;
    case 'schools':

      nextTable = table.setSelectedTab(table, 'schools');
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
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={<i className="fa fa-phone fa-2x" />}>
          <PhoneTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={<i className="fa fa-envelope fa-2x" />}>
          <LetterTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={<i className="fa fa-home fa-2x" />}>
          <HomeTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={<i className="fa fa-support fa-2x" />}>
          <SstTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab label={<i className="fa fa-gavel fa-2x" />}>
          <CourtTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
            table = {this.state.table}
            clickHandler = {this.clickHandler}
          />
        </Tab>
      </Tabs>
    );
  }
}

DashboardPage.propTypes = {
  usrAct          : PropTypes.object.isRequired,
  users           : PropTypes.object.isRequired,
  containerWidth  : PropTypes.number.isRequired,
  containerHeight : PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    users : state.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    usrAct : bindActionCreators(usrAct, dispatch)
  };
}

//https://github.com/digidem/react-dimensions/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(DashboardPage));

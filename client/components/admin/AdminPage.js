import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import { List } from 'immutable';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dimensions from 'react-dimensions';

import * as usrAct from '../../actions/userActions';
import * as schAct from '../../actions/schoolActions';
import * as locAct from './localActions';
import TableModel from '../../models/TableModel';
import SchoolsTab from './SchoolsTab';
import UsersTab from './UsersTab';

const table = new TableModel();

class AdminPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Register Initial Component State
    let nextTable = this.initializeTable('users');
    this.state = Object.assign({ table: nextTable }, {
      selectedItem : ''
    });

    this.initializeTable = this.initializeTable.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.getSelectedRowData = this.getSelectedRowData.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      table        : this.state.table,
      selectedItem : ''
    });
  }

  initializeTable(currentTab) {
    let nextTable;
    switch (currentTab) {
    case 'users':
      this.props.usrAct.getAllUsers();
      nextTable = table.setSelectedTab(table, 'users');
      break;
    case 'schools':
      this.props.schAct.getAllSchools();
      nextTable = table.setSelectedTab(table, 'schools');
      break;
    }
    nextTable = table.addPopovers(nextTable, {
      [locAct.EDIT] : false
    });
    nextTable = table.addDialogs(nextTable, {
      [locAct.EDIT_SCHOOL]   : false,
      [locAct.EDIT_ROLE]     : false,
      [locAct.REMOVE_USER]   : false,
      [locAct.NEW_SCHOOL]    : false,
      [locAct.REMOVE_SCHOOL] : false
    });

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

    // Clicked a table row
    case 'toggleSelected':
      nextTable = table.toggleSelectedRowIndex(this.state.table, data);
      this.setState({table: nextTable});
      break;

    // Clicked a dialog (modal window)
    case 'dialogClick':
      if(locAct.DIALOG_LIST.indexOf(data) != -1) {
        // Click inside dialog with associated API action
        let users;
        switch (data) {
        case locAct.EDIT_SCHOOL:
          users = this.state.selectedRows
            .description.map(row => row._id);
          this.props.usrAct.removeUser(users);
          break;
        case locAct.EDIT_ROLE:
          break;
        case locAct.REMOVE_USER:
          users = this.state.table.get('selectedData')
            .map(row => row._id);
          this.props.usrAct.removeUser(users.toArray());
          break;
        case locAct.NEW_SCHOOL:
          break;
        case locAct.REMOVE_SCHOOL:
          break;
        }
        nextTable = this.initializeTable(this.state.table.selectedTab);
        this.setState({table: nextTable});
      } else {
        nextTable = table.resetDialogs(this.state.table);
        this.setState({table: nextTable});
      }
      break;

    // Clicked a popover menu item -or- a RaisedButton
    case 'menuClick':
    case 'buttonClick':
      nextTable = table.setSelectedRowData(this.state.table,
        this.getSelectedRowData());
      if(locAct.DIALOG_LIST.indexOf(data) != -1) {
        nextTable = table.toggleDialogs(nextTable, data);
        nextTable = table.resetPopovers(nextTable);
      } else if(data == locAct.EDIT) {
        nextTable = table.togglePopovers(nextTable, data);
        nextTable = table.setAnchor(nextTable, event.currentTarget);
        nextTable = table.resetDialogs(nextTable);
      }
      this.setState({table: nextTable});
      break;

    // Clicked away from popover menu
    case 'popoverClose':
      nextTable = table.resetPopovers(this.state.table);
      this.setState({table: nextTable});
      //this.updateViewState(action, data, event);
      break;

    case 'dropdownChange':
      this.setState({
        selectedItem : data
      });
      break;
    }
  }

  // Returns full row data for selected table index values
  getSelectedRowData() {
    return this.props[this.state.table.get('selectedTab')]
      .filter((v, i) => this.state.table.get('selectedIndex')
      .indexOf(i) != -1);
  }

  tabHandler(data) {
    this.clickHandler('changeTabs', data);
  }

  render() {
    return (
      <Tabs
        style={{width: this.props.containerWidth}}
        value={this.state.table.get('selectedTab')}
      >
        <Tab
          label='Users'
          onActive={this.tabHandler}
          value='users'
        >
          <UsersTab
            view = {{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            users = {this.props.users}
            table = {this.state.table}
            selectedItem = {this.state.selectedItem}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          label='Schools'
          onActive={this.tabHandler}
          value='schools'
        >
          <SchoolsTab
            view = {{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            schools = {this.props.schools}
            table = {this.state.table}
            selectedItem = {this.state.selectedItem}
            clickHandler = {this.clickHandler}
          />
        </Tab>
      </Tabs>
    );
  }
}

AdminPage.propTypes = {
  usrAct          : PropTypes.object.isRequired,
  schAct          : PropTypes.object.isRequired,
  users           : PropTypes.instanceOf(List),
  schools         : PropTypes.instanceOf(List),
  containerWidth  : PropTypes.number.isRequired,
  containerHeight : PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    schools : state.schools,
    users   : state.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    usrAct : bindActionCreators(usrAct, dispatch),
    schAct : bindActionCreators(schAct, dispatch)
  };
}

//https://github.com/digidem/react-dimensions/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(AdminPage));

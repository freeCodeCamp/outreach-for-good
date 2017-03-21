import React, { PropTypes } from 'react';
import * as userActions from '../../actions/userActions';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import Dimensions from 'react-dimensions';

import {Tabs, Tab} from 'material-ui/Tabs';

import { List } from 'immutable';
import TableModel from '../../models/TableModel';

import SchoolsTab from './SchoolsTab';
import UsersTab from './UsersTab';

const table = new TableModel();

class AdminPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Pull users from the API
    this.props.actions.getAllUsers();

    // Register Initial Component State
    let nextTable = table.setSelectedTab(table, 'users');
    nextTable = table.addPopovers(nextTable, {editPopover: false});
    nextTable = table.addDialogs(nextTable, {
      editSchool : false,
      editRole   : false,
      removeUser : false
    });
    this.state = Object.assign({ table: nextTable }, {
      selectedDropdownItem : 'admin'
    });

    this.clickHandler = this.clickHandler.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      table                : this.state.table,
      selectedDropdownItem : 'admin'
    });
  }

  clickHandler(action, data, event) {
    let nextTable;
    switch (action) {

    // Clicked a table row
    case 'toggleSelected':
      nextTable = table.toggleSelectedRowIndex(this.state.table, data);
      this.setState({table: nextTable});
      break;

    // Clicked a main tab
    case 'changeTabs':
      if(this.state.selectedRows.index.length > 0) {
        nextTable = table.resetTable();
        this.setState({table: nextTable});
      }
      break;

    // Clicked a dialog (modal window)
    case 'dialogClick':
      if(data == 'remove-user') {
        let users = this.state.selectedRows
          .description.map(row => row._id);
        this.props.actions.removeUser(users);
      } else {
        nextTable = table.resetDialogs(this.state.table);
        this.setState({table: nextTable});
      }
      break;

    // Clicked a popover menu item -or- a RaisedButton
    case 'menuClick':
    case 'buttonClick':
      nextTable = table.setSelectedRowData(this.state.table,
        this.setSelectedRowData());
      if(data == 'editSchool' || data == 'editRole' || data == 'removeUser') {
        nextTable = table.toggleDialogs(nextTable, data);
        nextTable = table.resetPopovers(nextTable);
      } else if(data == 'editPopover') {
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
      console.log(action, data);
      this.updateDropdownState(action, data, event);
      break;
    }
  }

  tabHandler() {
    this.clickHandler('changeTabs');
  }

  updateDropdownState(action, data, event) {
    this.setState({
      selectedDropdownItem : data
    });
  }

  render() {
    return (
      <Tabs
        style={{width: this.props.containerWidth}}
        value={this.state.selectedTab}
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
            selectedDropdownItem = {this.state.selectedDropdownItem}
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
            schools = {this.props.users}
            table = {this.state.table}
            selectedDropdownItem = {this.state.selectedDropdownItem}
            clickHandler = {this.clickHandler}
          />
        </Tab>
      </Tabs>
    );
  }
}

AdminPage.propTypes = {
  actions         : PropTypes.object.isRequired,
  users           : PropTypes.instanceOf(List).isRequired,
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
    actions : bindActionCreators(userActions, dispatch)
  };
}

//https://github.com/digidem/react-dimensions/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(AdminPage));

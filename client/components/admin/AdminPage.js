import React, { PropTypes } from 'react';
import * as userActions from '../../actions/userActions';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import Dimensions from 'react-dimensions';

import {Tabs, Tab} from 'material-ui/Tabs';

import UserList from '../../models/UserListModel';
import TableModel from '../../models/TableModel';

import SchoolsTab from './SchoolsTab';
import UsersTab from './UsersTab';

const table = new TableModel();

class AdminPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.props.actions.getAllUsers();

    // Register Initial Component State
    let nextTable = table.setSelectedTab(table, 'users');
    nextTable = table.addPopovers(nextTable, {edit: false});
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
    console.log('Recieving Props');
    // Figure out how to use a varible for this
    this.setState({
      table                : this.state.table,
      selectedDropdownItem : 'admin'
    });
  }

  clickHandler(action, data, event) {
    let nextTable;
    switch (action) {
    case 'toggleSelected':
      nextTable = table.toggleSelectedIndex(this.state.table, data);
      this.setState({table: nextTable});
      break;
    case 'changeTabs':
      if(this.state.selectedRows.index.length > 0) {
        nextTable = table.resetTable();
        this.setState({table: nextTable});
      }
      break;
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
    case 'menuClick':
    case 'buttonClick':
      nextTable = table.setSelectedData(this.state.table,
        this.lookupTableValues(this.props[this.state.table.get('selectedTab')]));
      if(data == 'editSchool' || data == 'editRole' || data == 'removeUser') {
        nextTable = table.toggleDialogs(nextTable, data);
      } else if(data == 'editPopover') {
        nextTable = table.togglePopovers(nextTable, data);
        nextTable = table.setAnchor(nextTable, event.currentTarget);
      }
      this.setState({table: nextTable});
      break;
    case 'popoverClose':
      nextTable = table.resetDialogs(this.state.table);
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

  lookupTableValues(tableData) {
    return tableData.filter((v, i) =>
      this.state.table.get('selectedIndex').indexOf(i) != -1);
  }

  updateDropdownState(action, data, event) {
    this.setState({
      selectedDropdownItem : data
    });
  }

  updateViewState(action, data, event) {
    this.setState({
      selectedRows : {
        index       : this.state.selectedRows.index,
        description : this.lookupTableValues(this.props[this.state.selectedTab])
      },
      openDialogs : {
        editSchool : data == 'editSchoolDialog',
        editRole   : data == 'editRoleDialog',
        removeUser : data == 'removeUserDialog',
      },
      openMenus : {
        edit   : action == 'popoverClose' ? false : data == 'editPopover',
        anchor : action == 'popoverClose' ? null : event.currentTarget
      }
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
  users           : PropTypes.instanceOf(UserList).isRequired,
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

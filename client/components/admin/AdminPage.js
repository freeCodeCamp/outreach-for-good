import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';
import {Tabs, Tab} from 'material-ui/Tabs';

import Dimensions from 'react-dimensions';

import SchoolsTab from './SchoolsTab';
import UsersTab from './UsersTab';

class AdminPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.props.actions.getAllUsers();

    this.state = {
      selectedRows : [],
      openMenus    : {
        edit   : false,
        se     : false,
        anchor : null
      },
      openDialogs : [],
    };

    this.clickHandler = this.clickHandler.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
  }

  clickHandler(action, data, event) {
    //console.log('click', action, data);
    switch (action) {
    case 'toggleSelected':
      this.setState({
        selectedRows : data,
      });
      break;
    case 'changeTabs':
      if(this.state.selectedRows.length > 0) {
        this.setState({
          selectedRows : [],
        });
      }
      break;
    case 'buttonClick':
    case 'popoverClose':
      this.setState({
        openMenus : {
          edit   : action == 'popoverClose' ? false : data == 'Edit',
          se     : action == 'popoverClose' ? false : data == 'se',
          anchor : action == 'popoverClose' ? null : event.currentTarget

        }
      });
      break;
    }
  }

  tabHandler() {
    this.clickHandler('changeTabs');
  }

  render() {
    return (
      <Tabs
        style={{width: this.props.containerWidth}}
      >
        <Tab
          label='Users'
          onActive={this.tabHandler}
        >
          <UsersTab
            view = {{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
            users = {this.props.users}
            selectedRows = {this.state.selectedRows}
            openMenus = {this.state.openMenus}
            openDialogs = {this.state.openDialogs}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          label='Schools'
          onActive={this.tabHandler}
        >
          <SchoolsTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
            selectedRows = {this.state.selectedRows}
            openMenus = {this.state.openMenus}
            openDialogs = {this.state.openDialogs}
            clickHandler = {this.clickHandler}
          />
        </Tab>
      </Tabs>
    );
  }
}

AdminPage.propTypes = {
  actions         : PropTypes.object.isRequired,
  users           : PropTypes.array.isRequired,
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

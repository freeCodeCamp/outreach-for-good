import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';
import {Tabs, Tab} from 'material-ui/Tabs';

import Dimensions from 'react-dimensions';

import CourtTab from './CourtTab';
import HomeTab from './HomeTab';
import LetterTab from './LetterTab';
import PhoneTab from './PhoneTab';
import SstTab from './SstTab';
import StudentTab from './StudentTab';

class DashboardPage extends React.Component {

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
          />
        </Tab>
        <Tab label={<i className="fa fa-phone fa-2x" />}>
          <PhoneTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
          />
        </Tab>
        <Tab label={<i className="fa fa-envelope fa-2x" />}>
          <LetterTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
          />
        </Tab>
        <Tab label={<i className="fa fa-home fa-2x" />}>
          <HomeTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
          />
        </Tab>
        <Tab label={<i className="fa fa-support fa-2x" />}>
          <SstTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
          />
        </Tab>
        <Tab label={<i className="fa fa-gavel fa-2x" />}>
          <CourtTab
            view = {{
              width  : this.props.containerWidth,
              height : this.props.containerHeight - 48
            }}
            schools = {this.props.users}
          />
        </Tab>
      </Tabs>
    );
  }
}

DashboardPage.propTypes = {
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
  Dimensions({elementResize: true})(DashboardPage));

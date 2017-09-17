import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dimensions from 'react-dimensions-cjs';
import {Tabs, Tab} from 'material-ui/Tabs';

import UploadTab from './tabs/upload';
import ManageTab from './tabs/manage';
import './records.scss';

class RecordsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentTab: 'upload'};
  }

  handleChangeTab = tab => this.setState({currentTab: tab});

  render() {
    let viewport = {
      width  : this.props.containerWidth - 20,
      height : this.props.containerHeight - 48 - 80
    };
    return (
      <Tabs
        style={{width: this.props.containerWidth}}
        value={this.state.currentTab}
        onChange={this.handleChangeTab}
        >
        <Tab
          label="Upload"
          value="upload">
          <UploadTab />
        </Tab>
        <Tab
          label="Manage"
          value="manage">
          <ManageTab
            viewport={viewport}
          />
        </Tab>
      </Tabs>
    );
  }
}

RecordsPage.propTypes = {
  containerWidth  : PropTypes.number.isRequired,
  containerHeight : PropTypes.number.isRequired
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(RecordsPage));

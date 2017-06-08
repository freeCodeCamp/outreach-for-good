import React from 'react';
import PropTypes from 'prop-types';
import {Tabs, Tab} from 'material-ui/Tabs';
import UploadTab from './partials/UploadTab';
import ManageTab from './partials/ManageTab';
import Dimensions from 'react-dimensions-cjs';

import './RecordsPage.scss';

class RecordsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentTab: 'upload'};
  }

  render() {
    return (
      <Tabs
        style={{width: this.props.containerWidth}}
        value={this.state.currentTab}
        onChange={tab => {
          this.setState({currentTab: tab});
        }}
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
            view={{
              width  : this.props.containerWidth - 20,
              height : this.props.containerHeight - 48 - 80
            }}
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

export default (Dimensions({elementResize: true})(RecordsPage));

import React from 'react';
import PropTypes from 'prop-types';

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

export const StudentRecords = ({ title, students }) =>
<div className="column">
  <h1>{title}</h1>
  <ul>
    {students.map((entry, i) =>
      <li key={i}>
        {entry}
      </li>)}
  </ul>
</div>;

StudentRecords.propTypes = {
  title    : PropTypes.string,
  students : PropTypes.object
};

export default (Dimensions({elementResize: true})(RecordsPage));

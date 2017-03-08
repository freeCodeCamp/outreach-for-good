import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import UploadTab from './UploadTab';
import ManageTab from './ManageTab';

class RecordsPage extends Component {
  render() {
    return (
      <Tabs>
        <Tab label="Upload"><UploadTab /></Tab>
        <Tab label="Manage"><ManageTab /></Tab>
      </Tabs>
    );
  }
}

export default RecordsPage;

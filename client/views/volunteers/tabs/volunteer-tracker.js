import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import './volunteer-tracker.scss';

const VolunteerTracker = ({ dataSource, handleUpdateInput, handleAddVolunteer }) =>
  <div className="volunteer-tracker">
    <div className="controls">

      <AutoComplete
        hintText="Volunteer Name"
        dataSource={dataSource}
        onUpdateInput={handleUpdateInput}
      />

      <FloatingActionButton
        onTouchTap={handleAddVolunteer}>
        <ContentAdd />
      </FloatingActionButton>

    </div>
  </div>
;

export default VolunteerTracker;

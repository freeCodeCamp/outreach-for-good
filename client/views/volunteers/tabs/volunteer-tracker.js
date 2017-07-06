import React from 'react';
import PropTypes from 'prop-types';

import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

import './volunteer-tracker.scss';

const VolunteerTracker = ({ data, handleUpdate, handleAdd }) =>
  <div className="volunteer-tracker">
    <div className="controls">

      <AutoComplete
        hintText="Volunteer Name"
        dataSource={data}
        onUpdateInput={handleUpdate}
      />

      <RaisedButton
        label="Add Volunteer"
        onTouchTap={handleAdd}
      />

    </div>
  </div>
;

VolunteerTracker.propTypes = {
  data         : PropTypes.array,
  handleUpdate : PropTypes.func,
  handleAdd    : PropTypes.func
};

export default VolunteerTracker;

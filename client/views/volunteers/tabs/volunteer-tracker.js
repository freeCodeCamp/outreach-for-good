import React from 'react';
import PropTypes from 'prop-types';

// import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import SimpleTable from '../../../components/simple-table/simple-table';
import './volunteer-tracker.scss';

const columns = [
  'First Name',
  'Last Name',
  'School',
  'Volunteer Type'
];

const VolunteerTracker = ({ volunteers, handleUpdate, handleAdd }) => {
  console.log(volunteers);
  const data = volunteers.map(volunteer => [
    volunteer.firstName,
    volunteer.lastName,
    volunteer.school,
    volunteer.type
  ]);

  console.log(data);

  return (
    <div className="volunteer-tracker">
      <div className="controls">

        <RaisedButton
          label="Edit Volunteer"
          onTouchTap={() => console.log('edit clicked')}
          secondary
        />

        <RaisedButton
          label="Add Volunteer"
          onTouchTap={handleAdd}
          primary
        />

      </div>
      <SimpleTable
        columns={columns}
        data={data}
      />
    </div>
  );
};

VolunteerTracker.propTypes = {
  volunteers   : PropTypes.array,
  handleUpdate : PropTypes.func,
  handleAdd    : PropTypes.func
};

export default VolunteerTracker;

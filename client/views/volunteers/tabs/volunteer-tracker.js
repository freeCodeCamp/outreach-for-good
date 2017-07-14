<<<<<<< HEAD
import React from 'react';
import PropTypes from 'prop-types';

// import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
<<<<<<< HEAD
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
=======

import './volunteer-tracker.scss';

const VolunteerTracker = ({ data, handleUpdate, handleAdd }) =>
  <div className="volunteer-tracker">
    <div className="controls">
{/*
      <AutoComplete
        hintText="Volunteer Name"
        dataSource={data}
        onUpdateInput={handleUpdate}
      /> */}

      <RaisedButton
        label="Add Volunteer"
        onTouchTap={handleAdd}
      />
>>>>>>> 8d81fa2a7583b864906f776fd53bd53269bbdfac

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

VolunteerTracker.propTypes = {
  data         : PropTypes.array,
  handleUpdate : PropTypes.func,
  handleAdd    : PropTypes.func
};

export default VolunteerTracker;
=======
// import React from 'react';
// import PropTypes from 'prop-types';

// // import AutoComplete from 'material-ui/AutoComplete';
// import RaisedButton from 'material-ui/RaisedButton';
// <<<<<<< HEAD
// import SimpleTable from '../../../components/simple-table/simple-table';
// import './volunteer-tracker.scss';

// const columns = [
//   'First Name',
//   'Last Name',
//   'School',
//   'Volunteer Type'
// ];

// const VolunteerTracker = ({ volunteers, handleUpdate, handleAdd }) => {
//   console.log(volunteers);
//   const data = volunteers.map(volunteer => [
//     volunteer.firstName,
//     volunteer.lastName,
//     volunteer.school,
//     volunteer.type
//   ]);

//   console.log(data);

//   return (
//     <div className="volunteer-tracker">
//       <div className="controls">

//         <RaisedButton
//           label="Edit Volunteer"
//           onTouchTap={() => console.log('edit clicked')}
//           secondary
//         />
// =======

// import './volunteer-tracker.scss';

// const VolunteerTracker = ({ data, handleUpdate, handleAdd }) =>
//   <div className="volunteer-tracker">
//     <div className="controls">
// {/*
//       <AutoComplete
//         hintText="Volunteer Name"
//         dataSource={data}
//         onUpdateInput={handleUpdate}
//       /> */}

//       <RaisedButton
//         label="Add Volunteer"
//         onTouchTap={handleAdd}
//       />
// >>>>>>> 8d81fa2a7583b864906f776fd53bd53269bbdfac

//         <RaisedButton
//           label="Add Volunteer"
//           onTouchTap={handleAdd}
//           primary
//         />

//       </div>
//       <SimpleTable
//         columns={columns}
//         data={data}
//       />
//     </div>
//   );
// };

// VolunteerTracker.propTypes = {
//   volunteers   : PropTypes.array,
//   handleUpdate : PropTypes.func,
//   handleAdd    : PropTypes.func
// };

// VolunteerTracker.propTypes = {
//   data         : PropTypes.array,
//   handleUpdate : PropTypes.func,
//   handleAdd    : PropTypes.func
// };

// export default VolunteerTracker;
>>>>>>> 9d1cbd6c6046d3504e6fc9d275468bd81fb25bbe

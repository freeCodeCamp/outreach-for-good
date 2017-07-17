import React, {Component} from 'react';
import PropTypes from 'prop-types';


// import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import SimpleTable from '../../../components/simple-table/simple-table';
import TextField from 'material-ui/TextField';

import './volunteer-tracker.scss';

const columns = [
  'First Name',
  'Last Name',
  'School',
  'Volunteer Type'
];

class VolunteerTracker extends Component {
  state = {
    modal       : false,
    selectedRow : []
  }

  handleAddVolunteer = e => {
    e.preventDefault();

    const { school } = this.props;

    const volunteer = {
      school    : school._id,
      firstName : e.target['first-name'].value,
      lastName  : e.target['last-name'].value,
      type      : e.target['volunteer-type'].value
    };

    this.props.postVolunteer(school._id, volunteer);

    e.target.reset();

    this.handleModal();
  }

  handleModal = () => this.setState({ modal: !this.state.modal })

  handleRowSelect = selectedRow => this.setState({ selectedRow })

  render() {
    const { modal, selectedRow } = this.state;

    const { volunteers } = this.props;

    const isRowSelected = !!selectedRow.length;

    const data = volunteers.map(volunteer => [
      volunteer.firstName,
      volunteer.lastName,
      volunteer.school.name,
      volunteer.type
    ]);

    const actions = [
      <FlatButton
        key="cancel"
        label="Cancel"
        onTouchTap={this.handleModal}
        primary
      />,
      <FlatButton key="add"
        label="Submit"
        type="submit"
        form="add-volunteer"
        keyboardFocused
        primary
      />,
    ];

    return (
      <div className="volunteer-tracker">
        <div className="controls">
          <RaisedButton
            label="Edit Volunteer"
            onTouchTap={this.handleModal}
            disabled={!isRowSelected}
            secondary
          />

          <RaisedButton
            label="Add Volunteer"
            onTouchTap={this.handleModal}
            primary
          />
        </div>

        <SimpleTable
          columns={columns}
          data={data}
          onRowSelect={this.handleRowSelect}
          selectable
        />

        <Dialog
          title="Add Volunteer"
          actions={actions}
          modal={false}
          open={modal}
          onRequestClose={this.handleModal}>
          <form onSubmit={this.handleAddVolunteer} id="add-volunteer">
            <TextField
              id="volunteer-first-name"
              name="first-name"
              floatingLabelText="First Name"
            />
            <TextField
              id="volunteer-last-name"
              name="last-name"
              floatingLabelText="Last Name"
            />

            <RadioButtonGroup name="volunteer-type" defaultSelected="family-volunteer">
              <RadioButton
                value="family"
                label="Family Volunteer"
              />
              <RadioButton
                value="community"
                label="Community Volunteer"
              />
              <RadioButton
                value="student"
                label="Student Volunteer"
              />
            </RadioButtonGroup>
          </form>
        </Dialog>

        {/* <Dialog
          title="Edit Volunteer"
          actions={actions}
          modal={false}
          open={modal}
          onRequestClose={this.handleModal}>

          <form>
            <TextField
              id="volunteer-first-name"
              name="first-name"
              floatingLabelText="First Name"
            />
            <TextField
              id="volunteer-last-name"
              name="last-name"
              floatingLabelText="Last Name"
            />

            <RadioButtonGroup name="volunteer-type" defaultSelected="family-volunteer">
              <RadioButton
                value="family"
                label="Family Volunteer"
              />
              <RadioButton
                value="community"
                label="Community Volunteer"
              />
              <RadioButton
                value="student"
                label="Student Volunteer"
              />
            </RadioButtonGroup>
          </form>
        </Dialog> */}
      </div>
    );
  }
}

VolunteerTracker.propTypes = {
  volunteers    : PropTypes.array,
  handleUpdate  : PropTypes.func,
  handleModal   : PropTypes.func,
  postVolunteer : PropTypes.func
};

export default VolunteerTracker;

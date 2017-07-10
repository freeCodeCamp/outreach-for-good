import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';

import Overview from './tabs/overview';
import ParentTracker from './tabs/parent-tracker';
import VolunteerTracker from './tabs/volunteer-tracker';

import SchoolSelect from '../../components/school-select/school-select';

import * as schoolActions from '../../modules/school';
import * as volunteerActions from '../../modules/volunteers';

import './volunteers.scss';


class Volunteers extends Component {
  state = {
    school : null,
    modal  : false
  }

  componentDidMount() {
    this.props.schoolActions.getAllSchools();
  }

  componentWillUnmount() {
    this.setState({ school: null });
  }

  changeSchool = (e, i, school) => {
    this.props.volunteerActions.getVolunteers(school._id);

    this.setState({ school });
  }

  handleAddVolunteer = e => {
    e.preventDefault();
    const {school} = this.state;

    const volunteer = {
      school    : school._id,
      firstName : e.target['first-name'].value,
      lastName  : e.target['last-name'].value,
      type      : e.target['volunteer-type'].value
    };

    this.props.volunteerActions.postVolunteer(school._id, volunteer);
    e.target.reset();

    this.handleModal();
  }

  handleModal = () => {
    const {modal} = this.state;
    this.setState({ modal: !modal });
  }

  render() {
    const {school, modal} = this.state;

    const actions = [
      <FlatButton key="cancel"
        label="Cancel"
        primary
        onTouchTap={this.handleModal}
      />,
      <FlatButton key="add"
        label="Submit"
        type="submit"
        form="add-volunteer"
        keyboardFocused
        // onTouchTap={this.addVolunteer}
        primary
      />,
    ];

    return (
      <div className="volunteers">
        <div className="selector">
          <SchoolSelect
            value={school}
            schools={this.props.schools}
            changeSchool={this.changeSchool}
          />
        </div>
        {school
        && <Overview />}
        <div className="tabs">
          {school
            && <Tabs>
              {/* <Tab label="Overview">
              </Tab> */}
              <Tab label="Volunteer Tracker">
                <VolunteerTracker
                  volunteers={this.props.volunteers.volunteers}
                  handleUpdate={this.handleModal}
                  handleAdd={this.handleModal}
                />
              </Tab>
              <Tab label="Parent Tracker" disabled>
                <ParentTracker />
              </Tab>
            </Tabs>
          }
        </div>

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
      </div>
    );
  }
}

Volunteers.propTypes = {
  schoolActions    : PropTypes.object,
  volunteerActions : PropTypes.object,
  schools          : PropTypes.object
};

function mapStateToProps(state) {
  return {
    schools    : state.schools,
    volunteers : state.volunteers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    schoolActions    : bindActionCreators(schoolActions, dispatch),
    volunteerActions : bindActionCreators(volunteerActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Volunteers);

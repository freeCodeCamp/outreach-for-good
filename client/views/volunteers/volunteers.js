import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';

import ParentTracker from './tabs/parent-tracker';
import VolunteerTracker from './tabs/volunteer-tracker';

import SchoolSelect from '../../components/school-select/school-select';
import SimpleTable from '../../components/simple-table/simple-table';

import * as schoolActions from '../../modules/school';
import * as volunteerActions from '../../modules/volunteers';

import './volunteers.scss';

const columns = [
  'Category',
  'Sept / Σ',
  'Oct / Σ',
  'Nov / Σ',
  'Dec / Σ',
  'Jan / Σ',
  'Feb / Σ',
  'Mar / Σ',
  'Apr / Σ',
  'May / Σ',
  'Jun / Σ'
];

const simpleTableData = [
  ['Student Hours'],
  ['Family Hours'],
  ['Community Hours'],
  ['Volunteer Hours'],
  ['Total family volunteers']
];

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

    const volunteer = {
      firstName : e.target['first-name'].value,
      lastName  : e.target['last-name'].value,
      type      : e.target['volunteer-type'].value
    };

    this.props.volunteerActions.addVolunteer(volunteer);
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
        <div className="tabs">
          {school
            && <Tabs>
              <Tab label="Overview">
                <SimpleTable
                  columns={columns}
                  data={simpleTableData}
                />
              </Tab>
              <Tab label="Volunteer Tracker">
                <VolunteerTracker
                  data={[]}
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
    schools : state.schools
  };
}

function mapDispatchToProps(dispatch) {
  return {
    schoolActions    : bindActionCreators(schoolActions, dispatch),
    volunteerActions : bindActionCreators(volunteerActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Volunteers);

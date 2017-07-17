import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import FlatButton from 'material-ui/FlatButton';

import {Tabs, Tab} from 'material-ui/Tabs';

import Overview from './tabs/overview';
import ParentTracker from './tabs/parent-tracker';
import VolunteerTracker from './tabs/volunteer-tracker';

import SchoolSelect from '../../components/school-select/school-select';
// import SimpleTable from '../../components/simple-table/simple-table';

import * as schoolActions from '../../modules/school';
import * as volunteerActions from '../../modules/volunteers';

import './volunteers.scss';

class Volunteers extends Component {
  state = {
    school : null
  }

  componentDidMount() {
    this.props.schoolActions.getAllSchools();
  }

  componentWillUnmount() {
    this.setState({ school: null });
  }

  changeSchool = (e, i, school) => {
    //get the overview data for the specific school
    // this.props.volunteerActions.getOverview(school._id);

    //get all of the volunteers for the selected school
    this.props.volunteerActions.getVolunteers(school._id);

    //set the component state
    this.setState({ school });
  }

  render() {
    const { school } = this.state;

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
              <Tab label="Volunteer Tracker">
                <VolunteerTracker
                  postVolunteer={this.props.volunteerActions.postVolunteer}
                  school={school}
                  volunteers={this.props.volunteers.volunteers}
                />
              </Tab>
              <Tab label="Parent Tracker" disabled>
                <ParentTracker />
              </Tab>
            </Tabs>
          }
        </div>

      </div>
    );
  }
}

Volunteers.propTypes = {
  volunteers       : PropTypes.object,
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

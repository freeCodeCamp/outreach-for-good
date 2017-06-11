import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import SchoolSelect from '../../components/school-select/school-select';

import * as schoolActions from '../../modules/school';

import './volunteer-hours.scss';

class VolunteerHours extends Component {
  state = {
    school : null
  }

  componentDidMount() {
    this.props.actions.getAllSchools();
  }

  changeSchool = (e, newVal) => {
    this.setState({ school: this.props.schools[newVal] });
  }

  render() {
    return (
      <div className="volunteer-hours">
        <SchoolSelect
          value={this.state.school}
          schools={this.props.schools}
          changeSchool={this.changeSchool}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    schools : state.schools
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(schoolActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerHours);

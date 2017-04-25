import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {List} from 'immutable';
import Triggers from './partials/Triggers';
import SchoolSelect from '../../common/SchoolSelect';
import {getAllSchools, changeTriggers} from '../../../modules/schoolReducer';

class SchoolSettingsPage extends Component {
  constructor() {
    super();

    this.state = {
      selectedSchool : new List()
    };

    this.changeSchool = this.changeSchool.bind(this);
    this.changeTrigger = this.changeTrigger.bind(this);
  }


  componentWillMount() {
    this.props.actions.getAllSchools();
  }

  changeSchool(e, i, selectedSchool) {
    this.setState({ selectedSchool });
  }

  changeTrigger(e, newVal) {
    //this function clears the selected school
    //there is probably a better way to use immutable

    let schoolId = this.state.selectedSchool.get('_id');
    let triggers = this.state.selectedSchool
      .get('triggers').toJS();

    triggers[e.target.id].absences = +newVal;

    this.props.actions.changeTriggers(schoolId, { triggers });
  }

  render() {
    return (
      <div className="settings-page">
        {this.props.schools
          && <SchoolSelect
          value={this.state.selectedSchool}
          changeSchool={this.changeSchool}
          schools={this.props.schools}/>}
        {this.state.selectedSchool
        && <Triggers
            onChange={this.changeTrigger}
            triggers={this.state.selectedSchool.get('triggers')}
            />}
      </div>
    );
  }
}

SchoolSettingsPage.propTypes = {
  actions : PropTypes.object,
  schools : PropTypes.object
};

const mapStateToProps = state => ({
  schools : state.schools
});

const mapDispatchToProps = dispatch => ({
  actions : bindActionCreators({getAllSchools, changeTriggers}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SchoolSettingsPage);

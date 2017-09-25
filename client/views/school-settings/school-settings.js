import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { getAllSchools, changeTriggers } from '../../modules/school';
import { openSnackbar } from '../../modules/view';
import Triggers from '../../components/triggers/triggers';
import SchoolSelect from '../../components/school-select/school-select';
import './school-settings.scss';

class SchoolSettingsPage extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedSchool : null
    };

    this.changeSchool = this.changeSchool.bind(this);
    this.changeTrigger = this.changeTrigger.bind(this);
  }


  componentDidMount() {
    this.props.actions.getAllSchools();
  }

  componentWillReceiveProps(nextProps) {
    /**
     * When props update, if they are different open the snackbar
     */
    if(!nextProps.schools.equals(this.props.schools) && this.state.selectedSchool) {
      let currentSchool = nextProps.schools
      .get(this.state.selectedSchool).get('name');

      this.props.actions.openSnackbar(`Triggers updated for ${currentSchool}`);
    }
  }

  changeSchool(e, selectedSchool) {
    this.setState({ selectedSchool });
  }

  changeTrigger(e, newVal) {
    let currentSchool = this.props.schools.get(this.state.selectedSchool);
    let schoolId = currentSchool.get('_id');
    let triggers = currentSchool.get('triggers').toJS();

    triggers[e.target.id].absences = +newVal;
    this.props.actions.changeTriggers(schoolId, { triggers });
  }

  render() {
    let currentSchool = this.props.schools.get(this.state.selectedSchool);
    return (
      <div className="settings-page">
        <div className='settings-page-title'>
          <h3>School Settings</h3>
        </div>
        <div style={{textAlign: 'center', marginTop: -20}}>
          {this.props.schools
            && <SchoolSelect
            value={currentSchool}
            changeSchool={this.changeSchool}
            schools={this.props.schools}/>}
          <div style={{textAlign: 'left', maxWidth: 600, margin: 'auto', paddingTop: 10}}>
            {currentSchool
            && <Triggers
              onChange={this.changeTrigger}
              triggers={currentSchool.get('triggers')} />}
          </div>
        </div>
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
  actions : bindActionCreators({
    getAllSchools,
    changeTriggers,
    openSnackbar
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SchoolSettingsPage);

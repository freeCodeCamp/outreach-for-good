import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {List} from 'immutable';
import Triggers from './partials/Triggers';
import SchoolSelect from '../../common/SchoolSelect';
import {getAllSchools} from '../../../modules/schoolReducer';
import * as viewAct from '../../../modules/viewReducer';

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

  componetWillRecieveProps(nextProps) {
    this.setState({ selectedSchool: nextProps.schools[0] });
  }

  changeSchool(e, i, selectedSchool) {
    this.setState({ selectedSchool });
  }

  changeTrigger(e, newVal) {
    //update triggers action
    console.log(e.target.id, newVal);
  }

  render() {
    return (
      <div className="settings-page">
        <SchoolSelect
          value={this.state.selectedSchool}
          changeSchool={this.changeSchool}
          schools={this.props.schools}/>
        {this.state.selectedSchool.get('triggers')
        && <Triggers
            onChange={this.changeTrigger}
            triggers={this.state.selectedSchool.get('triggers')}
            />}
        <br/><br/>
        <button onClick={() => {
          this.props.viewAct.openSnackbar('Da Snackbar');
        }}>Success Demo</button>
        &nbsp;
        &nbsp;
        <button onClick={() => {
          this.props.viewAct.openSnackbar('Da Error', 'error');
        }}>Error Demo</button>
      </div>
    );
  }
}

SchoolSettingsPage.propTypes = {
  actions : PropTypes.object,
  viewAct : PropTypes.object,
  schools : PropTypes.object
};

const mapStateToProps = state => ({
  schools : state.schools
});

const mapDispatchToProps = dispatch => ({
  actions : bindActionCreators({getAllSchools}, dispatch),
  viewAct : bindActionCreators(viewAct, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SchoolSettingsPage);

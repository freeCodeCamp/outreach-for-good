import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';

import ParentTracker from './tabs/parent-tracker';
import VolunteerTracker from './tabs/volunteer-tracker';

import SchoolSelect from '../../components/school-select/school-select';
import SimpleTable from '../../components/simple-table/simple-table';
import * as schoolActions from '../../modules/school';

import './volunteers.scss';

const columns = [
  '',
  'Aug / Σ',
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
    this.props.actions.getAllSchools();
  }

  componentWillUnmount() {
    this.setState({ school: null });
  }

  changeSchool = (e, i, school) => {
    this.setState({ school });
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
        onTouchTap={this.addVolunteer}
      />,
      <FlatButton key="add"
        label="Submit"
        primary
        keyboardFocused
        onTouchTap={this.addVolunteer}
      />,
    ];

    return (
      <div className="volunteers">
        <div className="aggregates">
          <SchoolSelect
            value={school}
            schools={this.props.schools}
            changeSchool={this.changeSchool}
          />
          {school
            && <SimpleTable
              columns={columns}
              data={simpleTableData}
            />}
        </div>
        <div className="tabs">
          {school
            && <Tabs>
              <Tab label="Volunteer Tracker">
                <VolunteerTracker
                  data={[]}
                  handleUpdate={this.handleModal}
                  handleAdd={this.handleModal}
                />
              </Tab>
              <Tab label="Parent Tracker">
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
          onRequestClose={this.handleModal}
         />
      </div>
    );
  }
}

Volunteers.propTypes = {
  actions : PropTypes.object,
  schools : PropTypes.object
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Volunteers);

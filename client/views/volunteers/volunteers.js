import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

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
    school : null
  }

  componentDidMount() {
    this.props.actions.getAllSchools();
  }

  changeSchool = (e, i, school) => {
    this.setState({ school });
  }

  render() {
    return (
      <div className="volunteers">
        <div className="aggregates">
          <SchoolSelect
            value={this.state.school}
            schools={this.props.schools}
            changeSchool={this.changeSchool}
          />
          <SimpleTable
            columns={columns}
            data={simpleTableData}
          />
        </div>
        <div className="tabs">
          <Tabs>
            <Tab label="Volunteer Tracker">
              <VolunteerTracker
                dataSource={[]}
                handleUpdateInput={e => console.log(e)}
                handleAddVolunteer={e => console.log(e)}
              />
            </Tab>
            <Tab label="Parent Tracker">
              <ParentTracker />
            </Tab>
          </Tabs>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Volunteers);

import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import AbsenceRecordsTable from './AbsenceRecordsTable';

class ManageTab extends Component {
  constructor() {
    super();

    this.state = {
      school : null,
      absenceRecord : []
    };
  }

  getRecord(event, index, school) {
    let absenceRecord = this.props.absenceRecords
      .filter(record => record.schoolId === this.props.schools[school]._id);

    this.setState({ school, absenceRecord });
  }

  confirm() {
    console.log('manage tab confirmed');
  }

  cancel() {
    console.log('manage tab cancelled');
  }

  render() {
    return (
      <div className="manage-tab">
        <SelectField
          floatingLabelText="Select the school"
          value={this.state.school}
          onChange={this.getRecord.bind(this)}
          className="select-school"
        >
        {this.props.schools.map((school, i) =>
          <MenuItem key={i} value={i} primaryText={school.name} />
        )}
        </SelectField>
        {this.state.absenceRecord.length ?
          <AbsenceRecordsTable
            confirm={this.confirm}
            cancel={this.cancel.bind(this)}
            record={this.state.absenceRecord[0]}
          /> : ''}
      </div>
    );
  }
}
export default ManageTab;

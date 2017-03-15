import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AbsenceRecordsTable from './AbsenceRecordsTable';

class ManageTab extends Component {
  constructor() {
    super();

    this.state = {
      school        : null,
      absenceRecord : [],
      openDelete    : false,
      deleteText    : ''
    };
  }

  getRecord(event, index, school) {
    let absenceRecord = this.props.absenceRecords
      .filter(record => record.schoolId === this.props.schools[school]._id);

    this.setState({ school, absenceRecord });
  }

  deleteDialog() {
    this.setState({ openDelete: true });
  }

  changeDeleteText(e, deleteText) {
    this.setState({ deleteText });
  }

  closeDeleteDialog() {
    this.setState({ openDelete: false });
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
          <MenuItem
            key={i}
            value={i}
            primaryText={school.name}
          />
        )}
        </SelectField>
        <div className="display-container">
          {this.state.absenceRecord.length ?
            <AbsenceRecordsTable
              delete={this.deleteDialog}
              record={this.state.absenceRecord[0]}
              manageTab={true}
            /> : ''}
        </div>
        <Dialog
          title="Dialog With Actions"
          // actions={actions}
          modal={false}
          open={this.state.openDelete}
          onRequestClose={this.closeDeleteDialog}
        >
          WARNING!
          In addition to deleting the absence record, this operation will permanently delete:
          Triggered outreaches
          Students created, including associated:
          Outreaches
          Interventions
          Notes
          <TextField
            hintText="Type DELETE to confirm "
            value={this.state.deleteText}
            onChange={this.changeDeleteText}
          />
          <RaisedButton
            label="DELETE"
            disabled={this.state.deleteText !== 'DELETE'}
            primary
          />
        </Dialog>
      </div>
    );
  }
}
export default ManageTab;

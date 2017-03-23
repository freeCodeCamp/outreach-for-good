import React, {Component, PropTypes} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import EntryTable from './EntryTable';

class ManageTab extends Component {
  constructor() {
    super();

    this.state = {
      school     : 0,
      openDelete : false,
      deleteText : ''
    };

    this.getRecord = this.getRecord.bind(this);
  }

  getRecord(event, index, school) {
    let newSchool = this.props.schools[school];
    this.props.manageRecord(newSchool._id);
    this.setState({ school });
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
        <div className="manage-container">
          <SelectField
            floatingLabelText="Select the school"
            value={this.state.school}
            onChange={this.getRecord}
            className="select-school">
            {this.props.schools.map((school, i) =>
              <MenuItem
                key={i}
                value={i}
                primaryText={school.name}
              />
            )}
          </SelectField>
        </div>
        <div className="display-container">
          <EntryTable
            records={this.props.records}
          />
        </div>
        <Dialog
          title="Dialog With Actions"
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

ManageTab.propTypes = {
  records      : PropTypes.array.isRequired,
  schools      : PropTypes.array.isRequired,
  manageRecord : PropTypes.func
};

export default ManageTab;

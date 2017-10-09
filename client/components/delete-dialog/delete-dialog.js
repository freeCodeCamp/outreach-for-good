import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

/**
 * Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation.
 */
class DeleteDialog extends Component {

  state = {
    confirmDelete : false
  };

  handleChangeText = (e, newVal) => {
    this.setState({ confirmDelete: newVal === 'DELETE' });
  }

  render() {
    const actions = [
      <RaisedButton key="1"
        label="Cancel"
        onClick={this.props.closeDialog}
      />,
      <span> &nbsp;
        <RaisedButton key="2"
          label="Delete Record"
          disabled={!this.state.confirmDelete}
          onClick={() => this.props.removeRecord(this.props.selectedSchoolId)}
          primary
        />
      </span>,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.dialogOpen}
        onRequestClose={this.props.closeDialog}
        title={`Delete Record from ${this.props.selectedSchoolName}`}
      >
        <div className="alert" style={{fontSize: '1.4rem'}}>

          <h3 style={{margin: 0}}>WARNING!</h3>
          <h4>In addition to deleting the absence record, this operation will permanently delete:</h4>
          <ul>
            <li>Triggered outreaches</li>
            <li>Students created, including associated:</li>
            <ul>
              <li>Outreaches</li>
              <li>Interventions</li>
              <li>Notes</li>
            </ul>
          </ul>
        </div>
        <div style={{textAlign: 'center'}}>This action can only delete the most recent record.</div>
        <TextField
          id="change-delete-text"
          floatingLabelText="Type DELETE to confirm"
          onChange={this.handleChangeText}
          floatingLabelStyle={{color: 'rgba(0, 0, 0, 0.8)', fontWeight: 300}}
          fullWidth
        />
      </Dialog>
    );
  }
}

DeleteDialog.propTypes = {
  dialogOpen   : PropTypes.bool,
  closeDialog  : PropTypes.func,
  removeRecord : PropTypes.func,
  selectedSchoolName: PropTypes.string,
  selectedSchoolId: PropTypes.string
};

export default DeleteDialog;

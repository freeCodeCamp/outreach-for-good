import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

/**
 * Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation.
 */
class DeleteDialog extends Component {
  constructor() {
    super();
    this.state = {
      confirmDelete : false
    };

    this.handleChangeText = this.handleChangeText.bind(this);
  }

  handleChangeText(e, newVal) {
    // console.log(newVal);
    this.setState({ confirmDelete: newVal === 'DELETE' });
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        onTouchTap={this.props.closeDialog}
      />,
      <RaisedButton
        label="Delete Record"
        disabled={!this.state.confirmDelete}
        onTouchTap={this.props.removeRecord}
        primary
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.dialogOpen}
        onRequestClose={this.props.closeDialog}
      >
        <div className="alert">

          <h3>WARNING!</h3>
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
        <TextField
          id="change-delete-text"
          hintText="Type DELETE to confirm that you want to delete this record"
          onChange={this.handleChangeText}
          fullWidth
        />
      </Dialog>
    );
  }
}

DeleteDialog.propTypes = {
  dialogOpen : PropTypes.bool
};
export default DeleteDialog;

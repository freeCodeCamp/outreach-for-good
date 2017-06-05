import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

//needs to be stateless
class StudentDialog extends Component {
  constructor() {
    super();
    this.state = {
      value : null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getMenuItems = this.getMenuItems.bind(this);
  }

  handleChange(e, ind, value) {
    this.setState({ value });
  }

  handleSubmit() {
    const intervention = {
      school  : this.props.student.school._id,
      student : this.props.student._id,
      type    : this.state.value.title
    };

    console.log(intervention);
    this.props.dialogSubmit(this.props.student._id, intervention);

    this.props.dialogClose();
  }

  getMenuItems() {
    return this.props.data.map((interventionType, i) =>
      <MenuItem key={i}
        value={interventionType}
        primaryText={interventionType.title} />);
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.props.dialogClose}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onTouchTap={this.handleSubmit}
      />
    ];

    return (
      <div>
        <Dialog
          title="Create Intervention"
          actions={actions}
          modal={false}
          open={this.props.dialogOpen}
          onRequestClose={this.props.dialogClose}>
          <SelectField
            floatingLabelText="Intervention Type"
            value={this.state.value}
            onChange={this.handleChange}>
            {this.getMenuItems()}
          </SelectField>
        </Dialog>
      </div>
    );
  }
}

export default StudentDialog;

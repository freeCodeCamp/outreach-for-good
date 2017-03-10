import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class ManageTab extends Component {
  constructor() {
    super();

    this.state = {
      value : null
    };
  }

  changeSchool(event, index, value) {
    this.setState({value});
  }

  render() {
    return (
      <div className="manage-tab">
        <SelectField
          floatingLabelText="Select the school to manage uploaded data"
          value={this.state.value}
          onChange={this.changeSchool}
        >
          <MenuItem value={null} primaryText="" />
          <MenuItem value={false} primaryText="No" />
          <MenuItem primaryText="Yes" />
        </SelectField>
      </div>
    );
  }
}
export default ManageTab;

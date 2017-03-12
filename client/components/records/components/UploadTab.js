import React, {Component} from 'react';

import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import AbsenceRecordsTable from './AbsenceRecordsTable';
import Dropzone from 'react-dropzone';
import ParsePDF from './UploadService';

class UploadTab extends Component {
  constructor() {
    super();

    this.state = {
      loadingState : 'determinate',
      loadingValue : 0,
      record       : null,
      school       : 0
    };

    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  changeSchool(e, i, school) {
    this.setState({ school });
  }

  changeFile(accepted) {
    this.setState({ loadingState: 'indeterminate', loadingValue: null });
    if(accepted) {
      ParsePDF(this.props.schools[this.state.school], accepted[0])
      .then(record => {
        this.setState({
          record,
          loadingState : 'determinate',
          loadingValue : 100
        });
      });
    }
  }

  confirm() {
    this.props.confirm(this.state.record);
    this.cancel();
    this.props.changeTab('manage');
  }

  cancel() {
    this.setState({ record: null, loadingValue: 0, loadingState: 'determinate' });
  }

  render() {
    return (
      <div className="upload-tab">
        <Paper className={this.state.record ? 'hidden' : 'dropzone-paper'} zDepth={1}>
          <div className="column">
            <SelectField
              floatingLabelText="Select a school..."
              value={this.state.school}
              onChange={this.changeSchool.bind(this)}
              fullWidth
              >
              {this.props.schools.map((school, i) =>
                <MenuItem
                  key={i}
                  value={i}
                  primaryText={school.name} />
                )}
            </SelectField>
            <DatePicker
              defaultDate={new Date()}
              hintText="Landscape Inline Dialog"
              container="inline"
              mode="landscape"
              maxDate={new Date}
              fullWidth
            />
          </div>
          <div className="column">
            <Dropzone
              onDrop={this.changeFile.bind(this)}
              multiple={false}
              accept="application/pdf"
              className="dropzone">
              <h2>Click here or drop a PDF into this field</h2>
            </Dropzone>
          </div>
        </Paper>
        <LinearProgress
          mode={this.state.loadingState}
          value={this.state.loadingValue}
        />
        {this.state.record ?
          <AbsenceRecordsTable
            confirm={this.confirm}
            cancel={this.cancel.bind(this)}
            record={this.state.record} /> : ''}
      </div>
    );
  }
}
export default UploadTab;

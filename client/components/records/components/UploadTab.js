import React, {Component} from 'react';

import LinearProgress from 'material-ui/LinearProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import AbsenceRecordsTable from './AbsenceRecordsTable';
import Snackbar from 'material-ui/Snackbar';
import Dropzone from 'react-dropzone';
import ParsePDF from './UploadService';

class UploadTab extends Component {
  constructor() {
    super();

    this.state = {
      loadingState         : 'determinate',
      loadingValue         : 0,
      record               : null,
      school               : 0,
      recordResults        : false,
      date                 : new Date(),
      recordResultsMessage : ''
    };
  }

  changeSchool(e, i, school) {
    this.setState({ school });
  }

  changeFile(accepted) {
    this.setState({ loadingState: 'indeterminate', loadingValue: null });
    if(accepted) {
      let currentSchool = this.props.schools[this.state.school];
      let currentRecord = this.props.current.filter(current => {
        return current._id === currentSchool._id;
      })[0];
      ParsePDF(currentSchool, currentRecord, accepted[0])
      .then(record => {
        let message = '';
        if(record.creates) {
          message += `New records: ${record.creates.length}.`;
        }
        if(record.updates) {
          message += ` Updated records: ${record.updates.length}.`;
        }
        if(record.missingEntries.length) {
          message += ` Missing Records: ${record.missingEntries.length}.`;
        }
        if(record.newMissingStudents.length) {
          message += `New Missing Students: ${record.newMissingStudents.length}.`;
        }

        this.setState({
          record,
          date                 : new Date(),
          recordResults        : true,
          recordResultsMessage : message,
          loadingState         : 'determinate',
          loadingValue         : 100
        });
      });
    }
  }

  changeDate(e, date) {
    this.setState({ date });
  }

  confirm() {
    this.props.confirm(this.state.record, this.state.date);
    this.cancel();
    // this.props.changeTab('manage');
  }

  cancel() {
    this.setState({ record: null, loadingValue: 0, loadingState: 'determinate' });
  }

  closeSnackbar() {
    this.setState({
      recordResults        : false,
      recordResultsMessage : ''
    });
  }

  render() {
    return (
      <div className="upload-tab">
        <div className="dropzone-container">
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
              value={this.state.date}
              onChange={this.changeDate.bind(this)}
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
        </div>
        {this.state.loadingValue > 0 &&
          <LinearProgress
            mode={this.state.loadingState}
            value={this.state.loadingValue}
          />}
        {this.state.record ?
          <AbsenceRecordsTable
            confirm={this.confirm.bind(this)}
            cancel={this.cancel.bind(this)}
            record={this.state.record}
            uploadTab={true}
          /> : ''}
        <Snackbar
          open={this.state.recordResults}
          message={this.state.recordResultsMessage}
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar.bind(this)}
        />
      </div>
    );
  }
}
export default UploadTab;

import React, {Component, PropTypes} from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import AbsenceRecordsTable from './AbsenceRecordsTable';
import Snackbar from 'material-ui/Snackbar';
import Dropzone from 'react-dropzone';
import UploadService from './UploadService';

class UploadTab extends Component {
  constructor() {
    super();

    this.state = {
      loadingState  : 'determinate',
      loadingValue  : 0,
      record        : null,
      recordResults : false,
      date          : new Date(),
      snackBar      : ''
    };

    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.changeFile = this.changeFile.bind(this);
    this.changeSchool = this.changeSchool.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
  }

  /**
   * Fires when the school select is changed
   */
  changeSchool(e, i, selectedSchool) {
    this.setState({ selectedSchool });
  }

  /**
   * Fires when a file is dropped into the dropzone
   */
  changeFile(accepted) {
    if(accepted && this.state.selectedSchool) {
      let school = this.state.selectedSchool.toJS();
      let previousRecord = this.props.currentRecord
        .filter(record => record.school._id === school._id)[0];

      let uploadService = new UploadService(school, previousRecord, accepted[0]);

      uploadService.getRecord().then(({ record, message }) => {
        this.setState({ record, snackBar: message });
      });
    }
  }

  /**
   * Fires when the date is changed
   */
  changeDate(e, date) {
    this.setState({ date });
  }

  /**
   * Action to post absence record
   */
  confirm() {
    let record = this.state.record;
    record.date = this.state.date;
    this.props.addRecord(record);
    this.cancel();
  }

  /**
   * Removes the parsed record
   */
  cancel() {
    this.setState({ record: null, loadingValue: 0, loadingState: 'determinate' });
  }

  /**
   * closes the snackbar message
   */
  closeSnackbar() {
    this.setState({ snackBar: '' });
  }

  render() {
    return (
      <div className="upload-tab">
        <div className="dropzone-container">
          <div className="column">
            <SelectField
              floatingLabelText="Select a school..."
              value={this.state.selectedSchool}
              onChange={this.changeSchool}
              fullWidth
              >
              {this.props.schools.map((school, i) =>
                <MenuItem
                  key={i}
                  value={school}
                  primaryText={school.name} />
                )}
            </SelectField>
            <DatePicker
              value={this.state.date}
              onChange={this.changeDate}
              hintText="Landscape Inline Dialog"
              container="inline"
              mode="landscape"
              maxDate={new Date()}
              fullWidth
            />
          </div>
          <div className="column">
            {this.state.selectedSchool
              && <Dropzone
              onDrop={this.changeFile}
              multiple={false}
              accept="application/pdf"
              className="dropzone">
              <h2>Click here or drop a PDF into this field</h2>
            </Dropzone>}
          </div>
        </div>
        {this.state.loadingValue > 0
          && <LinearProgress
            mode={this.state.loadingState}
            value={this.state.loadingValue}
          />}
        {this.state.record
          && <AbsenceRecordsTable
            confirm={this.confirm}
            cancel={this.cancel}
            record={this.state.record}
            uploadTab
          />}
        <Snackbar
          open={!!this.state.snackBar}
          message={this.state.snackBar}
          autoHideDuration={6000}
          onRequestClose={this.closeSnackbar}
        />
      </div>
    );
  }
}

UploadTab.propTypes = {
  schools : PropTypes.object.isRequired,
  confirm : PropTypes.func
};

export default UploadTab;

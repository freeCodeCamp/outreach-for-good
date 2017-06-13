import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import SchoolSelect from '../../../components/school-select/school-select';
import LinearProgress from 'material-ui/LinearProgress';
import DatePicker from 'material-ui/DatePicker';
import Dropzone from 'react-dropzone';

import { fetchRecords } from '../../../modules/records';
import { getAllSchools } from '../../../modules/school';
import { addRecord } from '../../../modules/absence-record';
import AbsenceRecordsTable from '../records-table';
import UploadService from '../../../utils/upload-pdf/upload-pdf';

class UploadTab extends React.Component {
  state = {
    loadingState  : 'determinate',
    loadingValue  : 0,
    record        : null,
    recordResults : false,
    date          : new Date(),
    snackBar      : ''
  };

  componentDidMount() {
    this.props.actions.fetchRecords();
    this.props.actions.getAllSchools();
  }

  /**
   * Fires when the school select is changed
   */
  changeSchool = (e, i, selectedSchool) => {
    this.setState({ selectedSchool });
  }

  /**
   * Fires when a file is dropped into the dropzone
   */
  changeFile = accepted => {
    if(accepted && this.state.selectedSchool) {
      let school = this.state.selectedSchool.toJS();
      let previousRecord = this.props.records.current
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
  changeDate = (e, date) => {
    this.setState({ date });
  }

  /**
   * Action to post absence record
   */
  confirm = () => {
    let record = this.state.record;
    record.date = this.state.date;
    this.props.actions.addRecord(record);
    this.cancel();
  }

  /**
   * Removes the parsed record
   */
  cancel = () => {
    this.setState({ record: null, loadingValue: 0, loadingState: 'determinate' });
  }

  /**
   * closes the snackbar message
   */
  closeSnackbar = () => {
    this.setState({ snackBar: '' });
  }

  render() {
    return (
      <div className="upload-tab">
        <div className="dropzone-container">
          <div className="column">
            <SchoolSelect
              value={this.state.selectedSchool}
              schools={this.props.schools}
              changeSchool={this.changeSchool}
              fullWidth
            />

            {this.state.selectedSchool
            && <DatePicker
              value={this.state.date}
              onChange={this.changeDate}
              hintText="Landscape Inline Dialog"
              container="inline"
              mode="landscape"
              maxDate={new Date()}
              fullWidth
            />}

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
        {/* <ResponseSnackbar
          message={this.state.snackBar}
          closeSnackbar={this.closeSnackbar}
          type="success" /> */}
      </div>
    );
  }
}

UploadTab.propTypes = {
  schools        : PropTypes.object.isRequired,
  addRecord      : PropTypes.func,
  absenceRecords : PropTypes.object.isRequired,
  actions        : PropTypes.object.isRequired,
  records        : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    absenceRecords : state.absenceRecords,
    records        : state.records,
    schools        : state.schools
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators({
      fetchRecords,
      addRecord,
      getAllSchools
    }, dispatch)
    // absRecActions : bindActionCreators(absRecActions, dispatch),
    // fetchRecords  : bindActionCreators(fetchRecords, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadTab);

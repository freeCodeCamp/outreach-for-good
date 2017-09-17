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
    records       : null,
    recordResults : false,
    date          : new Date()
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
      const school = this.state.selectedSchool.toJS();
      const previousRecord = this.props.records.current
        .filter(record => record.school._id === school._id)[0];

      const uploadService = new UploadService(school, previousRecord, accepted[0]);

      uploadService.getRecords()
        .then(({records}) => {
          console.log(records);
          this.setState({ records });
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
    const {records} = this.state;
    records.date = this.state.date;
    this.props.actions.addRecord(records);
    this.cancel();
  }

  /**
   * Removes the parsed record
   */
  cancel = () => {
    this.setState({ records: null, loadingValue: 0, loadingState: 'determinate' });
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
        <div className='record-page-title'>
          <h3>New Attendance Record</h3>
        </div>
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
              className="dropzone"
              activeClassName="accept"
              rejectClassName="reject">
              {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                if(isDragActive) {
                  return <i className="fa fa-check fa-5x" />;
                }
                if(isDragReject) {
                  return <i className="fa fa-times fa-5x" />;
                }
                return acceptedFiles.length || rejectedFiles.length
                  ? <h2>{acceptedFiles[0].name}</h2>
                  : <h2>Click Here<br />or<br />Drag a PDF</h2>;
              }}

            </Dropzone>}
          </div>
        </div>
        {this.state.loadingValue > 0
          && <LinearProgress
            mode={this.state.loadingState}
            value={this.state.loadingValue}
          />}
        {this.state.records
          && <AbsenceRecordsTable
            confirm={this.confirm}
            cancel={this.cancel}
            record={this.state.records}
            uploadTab
          />}
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

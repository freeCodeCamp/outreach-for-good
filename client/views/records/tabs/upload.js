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

  constructor(props) {
    super(props);

    this.state = this.initialState;
  }

  componentDidMount() {
    Promise.all([
      this.props.actions.fetchRecords(),
      this.props.actions.getAllSchools()
    ]).then(this.setState({initialDataLoaded: true}));
  }

  initialState = {
    initialDataLoaded : false,
    loadingValue      : 0,
    records           : null,
    recordResults     : false,
    date              : new Date()
  };

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
      const previousRecord = this.props.records
        .filter(record => record.school._id === school._id)[0];

      let uploadService = new UploadService(school, previousRecord, accepted[0]);

      uploadService.getRecords()
        .then(({records}) => {
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
   * Users cannot upload records older than the most recent record
   */
  minDate = () => {
    let currentRecord = this.props.records.filter(r => r.school._id === this.state.selectedSchool.get('_id'))[0];
    let recordDate = new Date(currentRecord.date);
    return new Date(recordDate.setDate(recordDate.getDate() + 1));
  }


  /**
   * Action to post absence record
   */
  confirm = () => {
    const {records} = this.state;
    records.date = this.state.date;
    this.props.actions.addRecord(records);
    this.setState({ ...this.initialState });
  }

  /**
   * Removes the parsed record
   */
  cancel = () => {
    this.setState({ records: null, loadingValue: 0 });
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
              schools={this.props.schools.sort((a, b) => a.name > b.name ? 1 : -1)}
              changeSchool={this.changeSchool}
              fullWidth
              disabled={!this.state.initialDataLoaded}
            />

            {this.state.selectedSchool
            && <DatePicker
              value={this.state.date}
              onChange={this.changeDate}
              hintText="Landscape Inline Dialog"
              container="inline"
              mode="landscape"
              maxDate={new Date()}
              minDate={this.minDate()}
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
              <h2>Click Here<br />or<br />Drag a PDF</h2>
            </Dropzone>}
            {!this.state.selectedSchool
              && <div className="dropzone" style={{opacity: 0.4}} />
            }
          </div>
        </div>
        {this.state.loadingValue > 0
          && <LinearProgress
            mode='determinate'
            value={this.state.loadingValue}
          />}
        {this.state.record
          && <AbsenceRecordsTable
            confirm={this.confirm}
            cancel={this.cancel}
            record={this.state.record}
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
  records        : PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    absenceRecords : state.absenceRecords,
    records        : state.records.current,
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

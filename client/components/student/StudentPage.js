import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as studentActions from '../../actions/studentActions';
import StudentTabs from './partials/StudentTabs';
import StudentAbsenceRecordTable from './partials/StudentAbsenceRecordTable';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';

class StudentPage extends Component {

  componentWillMount() {
    this.props.actions.getStudent(this.props.params.studentId);
    this.props.actions.getStudentRecords(this.props.params.studentId);
  }

  componentWillUnmount() {
    console.log('unmount student');
    this.props.actions.unmountStudent();
  }

  render() {
    let student = this.props.student.student;
    return (
      <div className="student-page">
        <div className="info">
          <Paper className="col-data" zDepth={1}>
            <h1>{student.lastName}, {student.firstName} <small>Grade: {student.grade}</small></h1>
            <p>Student ID: (#{student.studentId})</p>
            <Checkbox
              label="IEP:"
              checked={student.iep}
            />
            <Checkbox
              label="CFA:"
              checked={student.cfa}
            />
            <Checkbox
              label="Withdrawn:"
              checked={student.withdrawn}
            />
          </Paper>
          <Paper className="col-attendance" zDepth={1}>
            <StudentAbsenceRecordTable records={this.props.student.records} />
          </Paper>
          <br/>
          <br/>
          <br/>
        </div>
        <div className="tabs">
          <StudentTabs />
        </div>
      </div>
    );
  }
}

StudentPage.propTypes = {
  params  : PropTypes.object,
  student : PropTypes.object.isRequired,
  actions : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    student : state.student
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(studentActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);

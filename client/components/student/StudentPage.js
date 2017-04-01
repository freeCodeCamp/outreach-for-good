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
  //
  // componentWillUnmount() {
  //   console.log('unmount student');
  //   this.props.actions.unmountStudent();
  // }

  render() {
    let student = this.props.student.student;
    return (
      <div className="student-page">
        <Paper className="info" zDepth={1}>
          <div className="col-data">
            <h1>{student.lastName}, {student.firstName} <small>Grade: {student.grade}</small></h1>
            <p>Student ID: (#{student.studentId})</p>
            <Checkbox
              label="IEP:"
              defaultChecked={student.iep}
            />
            <Checkbox
              label="CFA:"
              defaultChecked={student.cfa}
            />
            <Checkbox
              label="Withdrawn:"
              defaultChecked={student.withdrawn}
            />
          </div>
          <div className="col-attendance">
            <StudentAbsenceRecordTable records={this.props.student.records} />
          </div>
        </Paper>
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

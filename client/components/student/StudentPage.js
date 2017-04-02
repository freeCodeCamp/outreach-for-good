import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as studentActions from '../../actions/studentActions';
import {Tabs, Tab} from 'material-ui/Tabs';
import StudentAbsenceRecordTable from './partials/StudentAbsenceRecordTable';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import StudentDialog from './partials/StudentDialog';
import Notes from './partials/Notes';

class StudentPage extends Component {
  constructor(props) {
    super(props);

    this.studentId = props.params.studentId;

    //identify which tab is open when you browse this route
    console.log(props.params.tab);

    this.state = {
      currentTab : 'outreaches',
      dialogOpen : false
    };

    this.changeTab = this.changeTab.bind(this);
    this.dialogOpen = this.dialogOpen.bind(this);
    this.dialogClose = this.dialogClose.bind(this);
  }

  componentWillMount() {
    this.props.actions.getStudent(this.studentId);
    this.props.actions.getStudentRecords(this.studentId);
    this.props.actions.getStudentOutreaches(this.studentId);
    this.props.actions.getStudentNotes(this.studentId);
  }

  changeTab(currentTab) {
    this.setState({ currentTab });
  }

  dialogOpen(e) {
    console.log(e);
    this.setState({ dialogOpen: true });
  }

  dialogClose() {
    this.setState({ dialogOpen: false });
  }

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
          <Tabs>
            <Tab label="Outreaches" />
            <Tab label="Interventions" />
            <Tab label="Notes">
              <Notes
                notes={this.props.student.notes}
              />
            </Tab>
            <Tab label="Summary" />
          </Tabs>
        </div>
        <StudentDialog
          dialogOpen={this.state.dialogOpen}
          dialogClose={this.dialogClose}
        />
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

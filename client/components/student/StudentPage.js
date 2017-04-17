import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import StudentDialog from './partials/StudentDialog';
import Notes from './partials/Notes';

//import the partials used in this component
import StudentAbsenceRecordTable from './partials/StudentAbsenceRecordTable';
import StudentDialog from './partials/StudentDialog';
import Outreaches from './partials/Outreaches';
import Interventions from './partials/Interventions';
import Notes from './partials/Notes';
import Summary from './partials/Summary';

//import just the student actions used in this component
import {
  getStudent,
  getStudentRecords,
  getStudentOutreaches,
  getStudentNotes,
  getStudentInterventions,
  postStudentNote,
} from '../../actions/studentActions';

class StudentPage extends Component {
  constructor(props) {
    super(props);

    this.studentId = props.params.studentId;

    //identify which tab is open when you browse this route
    // console.log(props.params.tab);

    this.state = {
      currentTab : 'outreaches',
      dialogOpen : false
    };

    this.changeTab = this.changeTab.bind(this);
    this.dialogOpen = this.dialogOpen.bind(this);
    this.dialogClose = this.dialogClose.bind(this);

    this.postNote = this.postNote.bind(this);
    this.editNote = this.editNote.bind(this);
  }

  componentWillMount() {
    this.props.actions.getStudent(this.studentId);
    this.props.actions.getStudentRecords(this.studentId);
    this.props.actions.getStudentOutreaches(this.studentId);
    this.props.actions.getStudentInterventions(this.studentId);
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

  postNote(e) {
    e.preventDefault();
    let note = { note: e.target[0].value };
    this.props.actions.postStudentNote(this.studentId, note);
  }

  editNote(e) {
    console.log('Edit the note:', e);
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
            <StudentAbsenceRecordTable
              records={this.props.student.records} />
          </div>
        </Paper>
        <div className="tabs">
          <Tabs>
            <Tab label="Outreaches">
              <Outreaches
                outreaches={this.props.student.outreaches} />
            </Tab>
            <Tab label="Interventions">
              <Interventions
                postIntervention={this.props.actions.postStudentIntervention}
                interventions={this.props.student.interventions} />
            </Tab>
            <Tab label="Notes">
              <Notes
                postNote={this.postNote}
                editNote={this.editNote}
                notes={this.props.student.notes} />
            </Tab>
            <Tab label="Summary">
              <Summary />
            </Tab>
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
    actions : bindActionCreators({
      getStudent,
      getStudentRecords,
      getStudentOutreaches,
      getStudentInterventions,
      getStudentNotes,
      postStudentNote
    }, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);

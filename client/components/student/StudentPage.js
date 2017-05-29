import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';

//import the partials used in this component
import StudentAbsenceRecordTable from './partials/StudentAbsenceRecordTable';
import StudentDialog from './partials/StudentDialog';
import Outreaches from './partials/Outreaches';
import Interventions from './partials/Interventions';
import Notes from './partials/Notes';
import Summary from './partials/Summary';

//import just the student actions used in this component
import * as studentActions from '../../modules/studentReducer';

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
    this.onCheck = this.onCheck.bind(this);

    this.outreachNote = this.outreachNote.bind(this);
    this.outreachAction = this.outreachAction.bind(this);

    this.postNote = this.postNote.bind(this);
    this.editNote = this.editNote.bind(this);
  }

  componentDidMount() {
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

  onCheck(e, val) {
    switch (e.target.name) {
    case 'iep':
      this.props.actions.putStudentIep(this.studentId, {iep: val});
      break;
    case 'cfa':
      this.props.actions.putStudentCfa(this.studentId, {cfa: val});
      break;
    case 'withdrawn':
      this.props.actions.putStudentWithdrawn(this.studentId, {withdrawn: val});
      break;
    }
  }

  outreachNote(e) {
    e.preventDefault();
    let outreachId = e.target.id;
    let note = {note: e.target.outreachNote.value};

    this.props.actions.postOutreachNote(this.studentId, outreachId, note);
  }

  outreachAction(e, date) {
    console.log(e.target.id);
    let outreachId = e.target.id;
    let actionDate = {actionDate: date};

    this.props.actions.putOutreachAction(this.studentId, outreachId, actionDate);
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
              name="iep"
              onCheck={this.onCheck}
              checked={student.iep}
            />
            <Checkbox
              label="CFA:"
              name="cfa"
              onCheck={this.onCheck}
              checked={student.cfa}
            />
            <Checkbox
              label="Withdrawn:"
              name="withdrawn"
              onCheck={this.onCheck}
              checked={student.withdrawn}
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
                outreaches={this.props.student.outreaches}
                outreachAction={this.props.actions.putOutreachAction}
                outreachNote={this.outreachNote} />
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
    actions : bindActionCreators(studentActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);

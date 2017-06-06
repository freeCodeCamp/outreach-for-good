import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

//import the partials used in this component
import Parent from './partials/Parent';
import StudentAbsenceRecordTable from './partials/StudentAbsenceRecordTable';
import StudentDialog from './partials/StudentDialog';
import StudentCard from './partials/StudentCard';
import Notes from './partials/Notes';
import Summary from './partials/Summary';

//import just the student actions used in this component
import * as studentActions from '../../modules/studentReducer';
import * as settingsActions from '../../modules/settingsReducer';

import './StudentPage.scss';

class StudentPage extends React.Component {
  state = {
    dialogOpen : false
  }


  componentDidMount() {
    const {studentId} = this.props.params;
    this.props.actions.getStudent(studentId);
    this.props.actions.getStudentRecords(studentId);
    this.props.actions.getStudentOutreaches(studentId);
    this.props.actions.getStudentInterventions(studentId);
    this.props.actions.getStudentNotes(studentId);

    this.props.settingsActions.getInterventionTypes();
  }

  dialogOpen = () => {
    this.setState({ dialogOpen: true });
  }

  dialogClose = () => {
    this.setState({ dialogOpen: false });
  }

  onCheck = (e, val) => {
    const { studentId } = this.props.params;

    switch (e.target.name) {
    case 'iep':
      this.props.actions.putStudentIep(studentId, {iep: val});
      break;
    case 'cfa':
      this.props.actions.putStudentCfa(studentId, {cfa: val});
      break;
    case 'withdrawn':
      this.props.actions.putStudentWithdrawn(studentId, {withdrawn: val});
      break;
    }
  }

  //remove this function when you change the student card
  outreachNote = e => {
    e.preventDefault();

    const {studentId} = this.props.params;

    const outreachId = e.target.id;
    const note = {note: e.target.outreachNote.value};

    this.props.actions.postOutreachNote(studentId, outreachId, note);
  }

  postInterventionNote = e => {
    e.preventDefault();

    const { studentId } = this.props.params;
    const cardId = e.target.id;
    const note = {note: e.target.cardNote.value};

    this.props.actions.postInterventionNote(studentId, cardId, note);
  }

  putOutreachAction = (e, date) => {
    const { studentId } = this.props.params;

    const outreachId = e.target.id;
    const actionDate = { actionDate: date };

    this.props.actions.putOutreachAction(studentId, outreachId, actionDate);
  }


  render() {
    const { student, records, interventions, outreaches, notes } = this.props.student;

    return (
      <div className="student-page">
        <div className="info">
          <div className="col-data">
            <h1>{student.lastName}, {student.firstName} <small>Grade: {student.grade}</small></h1>
            <p>Student ID: (#{student.studentId})</p>
            <Checkbox
              label="IEP"
              name="iep"
              onCheck={this.onCheck}
              checked={student.iep}
            />
            <Checkbox
              label="CFA"
              name="cfa"
              onCheck={this.onCheck}
              checked={student.cfa}
            />
            <Checkbox
              label="Withdrawn"
              name="withdrawn"
              onCheck={this.onCheck}
              checked={student.withdrawn}
            />
          </div>
          <div className="col-attendance">
            <StudentAbsenceRecordTable records={records} />
          </div>
        </div>
        <div className="tabs">
          <Tabs>
            <Tab label="Parent Info">
              <Parent />
            </Tab>
            <Tab label="Outreaches">
              <div className="outreach-cards">
                {outreaches.map((card, i) =>
                  <StudentCard key={i}
                    cardType="outreach"
                    cardId={card._id}
                    cardData={card}
                    addNote={this.props.actions.postOutreachNote} />)}
              </div>
            </Tab>
            <Tab label="Interventions">
              <div className="intervention-cards">
                <div className="actions">
                  <RaisedButton
                    className="add-intervention"
                    icon={<FontIcon className="fa fa-plus" />}
                    label="Add Intervention"
                    onTouchTap={this.dialogOpen}
                    primary />
                </div>

                <div className="cards">
                  {interventions.map((card, i) =>
                    <StudentCard key={i}
                      cardType="intervention"
                      cardId={card._id}
                      cardData={card}
                      addNote={this.props.actions.postInterventionNote} />)}
                </div>
              </div>
            </Tab>
            <Tab label="Notes">
              <Notes
                studentId={student._id}
                addNote={this.props.actions.postStudentNote}
                notes={notes} />
            </Tab>
            <Tab label="Summary">
              {student
                && <Summary student={this.props.student} />}
            </Tab>
          </Tabs>
        </div>

        <StudentDialog
          data={this.props.settings.interventionTypes}
          dialogOpen={this.state.dialogOpen}
          dialogClose={this.dialogClose}
          dialogSubmit={this.props.actions.postIntervention}
          student={this.props.student.student} />

      </div>
    );
  }
}

StudentPage.propTypes = {
  params   : PropTypes.object,
  settings : PropTypes.object,
  student  : PropTypes.object.isRequired,
  actions  : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    student  : state.student,
    settings : state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions         : bindActionCreators(studentActions, dispatch),
    settingsActions : bindActionCreators(settingsActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);

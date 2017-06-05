import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

//import the partials used in this component
import StudentAbsenceRecordTable from './partials/StudentAbsenceRecordTable';
import StudentDialog from './partials/StudentDialog';
import Outreaches from './partials/Outreaches';
// import Interventions from './partials/Interventions';
import StudentCard from './partials/StudentCard';
import Notes from './partials/Notes';
import Summary from './partials/Summary';

//import just the student actions used in this component
import * as studentActions from '../../modules/studentReducer';
import * as settingsActions from '../../modules/settingsReducer';

import './StudentPage.scss';

class StudentPage extends React.Component {
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

    this.addNote = this.addNote.bind(this);

    this.postNote = this.postNote.bind(this);

    this.getStudentCard = this.getStudentCard.bind(this);
  }

  componentDidMount() {
    this.props.actions.getStudent(this.studentId);
    this.props.actions.getStudentRecords(this.studentId);
    this.props.actions.getStudentOutreaches(this.studentId);
    this.props.actions.getStudentInterventions(this.studentId);
    this.props.actions.getStudentNotes(this.studentId);

    this.props.settingsActions.getInterventionTypes();
  }

  changeTab(currentTab) {
    this.setState({ currentTab });
  }

  dialogOpen() {
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

  //remove this function when you change the student card
  outreachNote(e) {
    e.preventDefault();
    let outreachId = e.target.id;
    let note = {note: e.target.outreachNote.value};

    this.props.actions.postOutreachNote(this.studentId, outreachId, note);
  }

  addNote(e) {
    e.preventDefault();

    let cardId = e.target.id;
    let note = {note: e.target.cardNote.value};
    console.log(cardId, note);

    this.props.actions.postInterventionNote(this.studentId, cardId, note);
  }

  outreachAction(e, date) {
    let outreachId = e.target.id;
    let actionDate = {actionDate: date};

    this.props.actions.putOutreachAction(this.studentId, outreachId, actionDate);
  }

  getStudentCard(card, i) {
    console.log(card);
    return (
      <StudentCard key={i}
        title={card.type}
        subtitle={new Date(card.createdDate).toDateString()}
        cardId={card._id}
        notes={card.notes}
        addNote={this.addNote}
      />
    );
  }

  render() {
    let student = this.props.student.student;
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
            <StudentAbsenceRecordTable
              records={this.props.student.records} />
          </div>
        </div>
        <div className="tabs">
          <Tabs>
            <Tab label="Parent Info">
              <p>parent info</p>
            </Tab>
            <Tab label="Outreaches">
              <div className="outreach-cards">
                {this.props.student.outreaches.map((outreach, i) =>
                  <Outreaches key={i}
                    outreachId={outreach._id}
                    outreachNote={this.outreachNote}
                    outreachAction={this.outreachAction}
                    outreach={outreach} />)}
              </div>
            </Tab>
            <Tab label="Interventions">
              <div className="intervention-cards">
                <RaisedButton
                  className="add-intervention"
                  icon={<FontIcon className="fa fa-plus" />}
                  label="Add Intervention"
                  onTouchTap={this.dialogOpen}
                  primary />

                <div className="cards">
                  {this.props.student.interventions.map(this.getStudentCard)}
                </div>
              </div>
            </Tab>
            <Tab label="Notes">
              <Notes
                postNote={this.postNote}
                editNote={this.editNote}
                notes={this.props.student.notes} />
            </Tab>
            <Tab label="Summary">
              {this.props.student.student
                && <Summary
                student={this.props.student} />}
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

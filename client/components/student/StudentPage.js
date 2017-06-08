import React, {Component} from 'react';
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

class StudentPage extends Component {
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
              <div className="tab-view">
                <div className="actions">
                  <RaisedButton
                    label="Add parent hours"
                    primary />
                </div>
              </div>
              <Parent />
            </Tab>
            <Tab label="Outreaches">
              <div className="tab-view">
                <div className="cards">
                  {outreaches.map((card, i) =>
                    <div className="card" key={i}>
                      <StudentCard
                        cardType="outreach"
                        cardId={card._id}
                        cardData={card}
                        addNote={this.props.actions.postOutreachNote} />
                    </div>)}
                </div>
              </div>
            </Tab>
            <Tab label="Interventions">
              <div className="tab-view">
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
                    <div className="card" key={i}>
                      <StudentCard
                        cardType="intervention"
                        cardId={card._id}
                        cardData={card}
                        addNote={this.props.actions.postInterventionNote} />
                    </div>)}
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

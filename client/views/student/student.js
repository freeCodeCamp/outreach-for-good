import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as studentActions from '../../modules/student';
import * as settingsActions from '../../modules/settings';

import {Tabs, Tab} from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import Parent from '../../components/student-parent-card/student-parent-card';
import StudentAbsenceRecordTable from '../../components/student-abs-record-table/student-abs-record-table';
import StudentDialog from '../../components/student-dialog/student-dialog';
import StudentNotes from '../../components/student-notes/student-notes';
import StudentCard from '../../components/student-card/student-card';
import StudentSummaryCard from '../../components/student-summary-card/student-summary-card';
import './student.scss';

class StudentPage extends React.Component {
  state = {
    dialogOpen : false
  }

  componentDidMount() {
    const {studentId} = this.props.params;

    this.props.studentActions.getStudent(studentId);
    this.props.studentActions.getStudentRecords(studentId);
    this.props.studentActions.getStudentOutreaches(studentId);
    this.props.studentActions.getStudentInterventions(studentId);
    this.props.studentActions.getStudentNotes(studentId);

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
      this.props.studentActions.putStudentIep(studentId, {iep: val});
      break;
    case 'cfa':
      this.props.studentActions.putStudentCfa(studentId, {cfa: val});
      break;
    case 'withdrawn':
      this.props.studentActions.putStudentWithdrawn(studentId, {withdrawn: val});
      break;
    }
  }

  render() {
    const { student, absenceRecords, interventions, outreaches, notes } = this.props.student;
    if(!student || !student._id) {
      return null;
    }

    return (
      <div className="student-page">
        <div className="student-name-header">
          <h3>{student.firstName} {student.lastName}</h3>
          <span className={'student-id-heading'}><b>Student ID:</b> {student.studentId}</span>
        </div>
        <div className="info">
          <div className="col-data">
            <div className="col-heading">
              Student Info
            </div>
            <div className="student-info">
              <div className="student-settings">
                <Checkbox
                  label="IEP"
                  name="iep"
                  onCheck={this.onCheck}
                  checked={student.iep}
                  labelStyle={{fontWeight: 400}}
                  inputStyle={{width: '100px'}}
                />
                <Checkbox
                  label="CFA"
                  name="cfa"
                  onCheck={this.onCheck}
                  checked={student.cfa}
                  labelStyle={{fontWeight: 400}}
                  inputStyle={{width: '100px'}}
                />
                <Checkbox
                  label="Withdrawn"
                  name="withdrawn"
                  onCheck={this.onCheck}
                  checked={student.withdrawn}
                  labelStyle={{fontWeight: 400}}
                  inputStyle={{width: '100px'}}
                />
              </div>
              <div className="student-data">
                <b>School:</b> {student.school.name}<br />
                <b>Grade:</b> {student.grade}
              </div>
            </div>
          </div>
          <div className="col-attendance">
            <div className="col-heading">
              Attendance Data
            </div>
          {absenceRecords
            && <StudentAbsenceRecordTable absenceRecords={absenceRecords} />
          }
          </div>
        </div>
        <div className="tabs">
          <Tabs>
            <Tab label="Outreaches">
              <div className="tab-view">
                <div className="cards">
                  {outreaches && outreaches.map((card, i) =>
                    <div className="card" key={i}>
                      <StudentCard
                        cardType="outreach"
                        cardId={card._id}
                        cardData={card}
                        addNote={this.props.studentActions.postOutreachNote} />
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
                  {interventions && interventions.map((card, i) =>
                    <div className="card" key={i}>
                      <StudentCard
                        cardType="intervention"
                        cardId={card._id}
                        cardData={card}
                        addNote={this.props.studentActions.postInterventionNote} />
                    </div>)}
                </div>
              </div>
            </Tab>
            <Tab label="Notes">
            {notes
              && <StudentNotes
                studentId={student._id}
                addNote={this.props.studentActions.postStudentNote}
                notes={notes} />
            }
            </Tab>
            <Tab label="Summary">
            {student && outreaches && interventions && notes && absenceRecords &&
              <StudentSummaryCard
                student={student}
                absenceRecords={absenceRecords}
                outreaches={outreaches}
                interventions={interventions}
                notes={notes}
              />
            }
            </Tab>
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
          </Tabs>
        </div>
        { this.props.settings
          && <StudentDialog
            data={this.props.settings.interventionTypes}
            dialogOpen={this.state.dialogOpen}
            dialogClose={this.dialogClose}
            dialogSubmit={this.props.studentActions.postIntervention}
            student={this.props.student.student} />
        }
      </div>
    );
  }
}

StudentPage.propTypes = {
  params          : PropTypes.object,
  settings        : PropTypes.object,
  student         : PropTypes.object.isRequired,
  studentActions  : PropTypes.object.isRequired,
  settingsActions : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    student  : state.student,
    settings : state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    studentActions  : bindActionCreators(studentActions, dispatch),
    settingsActions : bindActionCreators(settingsActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);

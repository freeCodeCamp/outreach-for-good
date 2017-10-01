import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as studentActions from '../../modules/student';
import * as settingsActions from '../../modules/settings';

import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import Parent from '../../components/student-parent-card/student-parent-card';
import StudentAbsenceRecordTable from '../../components/student-abs-record-table/student-abs-record-table';
import StudentNotes from '../../components/student-notes/student-notes';
import StudentCard from '../../components/student-card/student-card';
import StudentOutreaches from '../../components/student-outreaches/student-outreaches';
import StudentInterventions from '../../components/student-interventions/student-interventions';
import StudentInfoPane from '../../components/student-info-pane/student-info-pane';
import StudentSummaryCard from '../../components/student-summary-card/student-summary-card';
import './student.scss';

class StudentPage extends React.Component {
  state = {
    dialogOpen        : false,
    initialDataLoaded : false,
    selectedTab       : 'outreaches'
  }

  componentDidMount() {
    const {studentId} = this.props.params;

    Promise.all([
      this.props.studentActions.getStudent(studentId),
      this.props.studentActions.getStudentRecords(studentId),
      this.props.studentActions.getStudentOutreaches(studentId),
      this.props.studentActions.getStudentInterventions(studentId),
      this.props.studentActions.getStudentNotes(studentId),
      this.props.settingsActions.getInterventionTypes()
    ]).then(() => this.setState({initialDataLoaded: true}));
  }

  clickHandler = (action, data, event) => {
    const { studentId } = this.props.params;
    switch (action) {
    case 'setIep':
      this.props.studentActions.putStudentIep(studentId, data);
      break;
    case 'setCfa':
      this.props.studentActions.putStudentCfa(studentId, data);
      break;
    case 'setWithdrawn':
      this.props.studentActions.putStudentWithdrawn(studentId, data);
      break;
    case 'addOutreachNote':
      this.props.studentActions.postOutreachNote(studentId, data, event);
      break;
    case 'updateOutreachAction':
      this.props.studentActions.putOutreachAction(studentId, data, event);
      break;
    case 'addInterventionNote':
      this.props.studentActions.postInterventionNote(studentId, data, event);
      break;
    case 'addIntervention':
      this.props.studentActions.postIntervention(studentId, {
        type: data,
        school: this.props.student.student.school._id,
        student: studentId
      });
      break;
    case 'archiveIntervention':
      this.props.studentActions.putInterventionArchive(studentId, data, {archived: true});
      break;
    case 'unArchiveIntervention':
      this.props.studentActions.putInterventionArchive(studentId, data, {archived: false});
      break;
    case 'deleteIntervention':
      this.props.studentActions.deleteIntervention(studentId, data);
      break;
    case 'addInterventionNote':
      this.props.studentActions.postInterventionNote(studentId, data, event);
      break;
    }
  } // End of: clickHandler()

  tabHandler = tab => {
    this.setState({selectedTab: tab.props.value});
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
            <StudentInfoPane
              student={student}
              clickHandler={this.clickHandler}
            />
          </div>
          <div className="col-attendance">
            <div className="col-heading">
              Attendance Data
            </div>
            {absenceRecords &&
            <StudentAbsenceRecordTable
              absenceRecords={absenceRecords}
            />
            }
          </div>
        </div>
        <div className="tabs">
          <Tabs value={this.state.selectedTab}>
            <Tab label="Outreaches" value="outreaches" onActive={this.tabHandler}>
              {outreaches &&
              <StudentOutreaches
                outreaches={outreaches}
                clickHandler={this.clickHandler}
              />
              }
            </Tab>
            <Tab label="Interventions" value="interventions" onActive={this.tabHandler}>
              {interventions && this.props.settings && this.props.settings.interventionTypes &&
                this.props.settings.interventionTypes.length &&
              <StudentInterventions
                interventions={interventions}
                settings={this.props.settings}
                selectedTab={this.state.selectedTab}
                clickHandler={this.clickHandler}
              />
              }
            </Tab>
            <Tab label="Notes" value="notes" onActive={this.tabHandler}>
            {notes && false &&
              <StudentNotes
                studentId={student._id}
                addNote={this.props.studentActions.postStudentNote}
                notes={notes}
              />
            }
            </Tab>
            <Tab label="Summary" value="summary" onActive={this.tabHandler}>
            {student && outreaches && interventions && notes && absenceRecords
              && <StudentSummaryCard
                student={student}
                absenceRecords={absenceRecords}
                outreaches={outreaches}
                interventions={interventions}
                notes={notes}
              />
            }
            </Tab>
            {/* <Tab label="Parent Info">
              <div className="tab-view">
                <div className="actions">
                  <RaisedButton
                    label="Add parent hours"
                    primary />
                </div>
              </div>
              <Parent />
            </Tab> */}
          </Tabs>
        </div>

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

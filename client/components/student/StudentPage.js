import React, {Component} from 'react';
import StudentTabs from './components/StudentTabs';
import Paper from 'material-ui/Paper';

class StudentPage extends Component {
  render() {
    return (
      <div className="student-page">
        <div className="info">
          <Paper className="col-data" zDepth={1}>
            <h1>Student Name <span>Grade</span><span>School</span></h1>
            <p>Student ID</p>
            <p>IEP</p>
            <p>CFA</p>
            <p>Withdrawn</p>
          </Paper>
          <Paper className="col-attendance" zDepth={1}>
            Some kind of attendance table
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
export default StudentPage;

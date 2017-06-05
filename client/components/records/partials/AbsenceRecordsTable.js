import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  toggle : {
    maxWidth : 250
  },
  card : {
    paddingTop : 10
  }
};

const StudentTable = props =>
  <Card style={styles.card}>
    <CardHeader
      title={props.studentType}
      subtitle={`${props.students.length} records`}
      style={styles.toggle}
      showExpandableButton={props.students.length > 0}
    />
    <CardText expandable>
      <Table height="400">
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Student ID</TableHeaderColumn>
            <TableHeaderColumn>Grade</TableHeaderColumn>
            <TableHeaderColumn>Absences</TableHeaderColumn>
            <TableHeaderColumn>Enrolled</TableHeaderColumn>
            <TableHeaderColumn>Present</TableHeaderColumn>
            <TableHeaderColumn>Tardies</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {props.students.map((item, i) =>
            <TableRow key={i}>
              <TableRowColumn>{item.student.lastName}, {item.student.firstName}</TableRowColumn>
              <TableRowColumn>{item.student.studentId}</TableRowColumn>
              <TableRowColumn>{item.student.grade}</TableRowColumn>
              <TableRowColumn>{item.entry.absences}</TableRowColumn>
              <TableRowColumn>{item.entry.enrolled}</TableRowColumn>
              <TableRowColumn>{item.entry.present}</TableRowColumn>
              <TableRowColumn>{item.entry.tardies}</TableRowColumn>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardText>
  </Card>;

StudentTable.propTypes = {
  students    : PropTypes.array,
  studentType : PropTypes.string
};

class AbsenceRecordsTable extends Component {
  render() {
    let buttons;
    if(this.props.manageTab) {
      buttons
        = <div className="buttons">
          <RaisedButton
            onClick={this.props.delete}
            label="Delete Records"
            primary
          />;
        </div>
      ;
    } else if(this.props.uploadTab) {
      buttons
        = <div className="buttons">
          <RaisedButton
            onClick={this.props.confirm}
            label="Confirm"
            primary
          />
          <RaisedButton
            onClick={this.props.cancel}
            label="Cancel"
            secondary
          />
        </div>
      ;
    }

    return (
      <div className="display-container">
        {buttons}
        {this.props.record.creates
          ? <StudentTable
              studentType="New Students"
              students={this.props.record.creates}
            />
          : <StudentTable
              studentType="Updated Students"
              students={this.props.record.updates}
            />}
        <StudentTable
          studentType="New Missing Records"
          students={this.props.record.newMissingStudents} />
        <StudentTable
          studentType="Missing Records"
          students={this.props.record.missingEntries} />
      </div>
    );
  }
}

AbsenceRecordsTable.propTypes = {
  students  : PropTypes.array,
  record    : PropTypes.object,
  confirm   : PropTypes.func,
  cancel    : PropTypes.func,
  delete    : PropTypes.func,
  uploadTab : PropTypes.bool,
  manageTab : PropTypes.bool
};

export default AbsenceRecordsTable;

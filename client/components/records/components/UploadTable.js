import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

class UploadTable extends Component {

  render() {
    return (
      <Paper className="display-paper">
        <div className="buttons">
          <RaisedButton onClick={this.props.confirm} label="Confirm" primary />
          <RaisedButton onClick={this.props.cancel} label="Cancel" secondary />
        </div>
        <Table>
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
            {this.props.students.map((item, i) =>
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
      </Paper>
    );
  }
}
export default UploadTable;

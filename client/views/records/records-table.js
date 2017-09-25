import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

import StudentTable from '../../components/student-table/student-table';

class AbsenceRecordsTable extends React.Component {
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

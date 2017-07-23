import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {List} from 'immutable';

import DataTableContainer from '../../../components/data-table/data-table-container';
import DeleteDialog from '../../../components/delete-dialog/delete-dialog';
import SchoolSelect from '../../../components/school-select/school-select';

import {recordsTableColumns} from '../records.defs';

import {
  fetchSchoolRecordList,
  removeRecord } from '../../../modules/absence-record';

import RaisedButtonModel from '../../../models/raised-button';
import TableModel from '../../../models/table';

const table = new TableModel();

class ManageTab extends React.Component {
  state = {
    table,
    dialogOpen : false,
    loaded     : false
  };

  componentWillReceiveProps = nextProps => {
    if(this.state.school
      && nextProps.absenceRecords.size
      && !this.state.loaded) {
      // Props incoming, ToDo: verify absenceRecords changed
      let nextTable = table.updateSortCol(this.state.table, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);

      console.log('props recieved');

      this.setState({
        table  : nextTable,
        loaded : true
      });
    } else {
      this.setState({
        loaded : true
      });
    }
  }

  /**
   * Updates the data table with selected school
   */
  changeSchool = (e, i, school) => {
    const schoolId = school.get('_id');
    this.props.actions.fetchSchoolRecordList(schoolId);
    this.setState({
      school,
      selectedRecord : null,
      loaded         : false
    });
  }

  /**
   * Handles the clicks on the datatable
   */
  clickHandler = (action, data) => {
    switch (action) {
    case 'toggleSortCol': {
      break;
    }
    default: {
      switch (data) {
      case 'deleteRecord': {
        this.setState({ dialogOpen: !this.state.dialogOpen });
        break;
      }
      case 'editRecord': {
        console.log('edit record');
        break;
      }
      }
    }
    }
  }

  removeRecord = () => {
    let recordId = this.props.absenceRecords.get(0).get('recordId');
    this.props.actions.removeRecord(recordId);
    this.closeDialog();
    this.changeSchool(null, null, this.state.selectedSchool);
  }

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  }

  /**
  * Display record is used when clicking on a row to display students
  */
  displayRecord = record => {
    //console.log('row clicked: ', record);
    let selectedRecord = {};

    selectedRecord.newMissingStudents = this.props.absenceRecords
      .get(record)
      .get('newMissingStudents')
      // .map(entry => entry.get('_id'));
      .map((entry, i) => <Link key={i} to={`/student/${entry.get('_id')}`}>{entry.firstName} {entry.lastName}</Link>);

    selectedRecord.createdStudents = this.props.absenceRecords
      .get(record)
      .get('createdStudents')
      .map((entry, i) => <Link key={i} to={`/student/${entry.get('_id')}`}>{`${entry.get('firstName')} ${entry.get('lastName')}`}</Link>);

    this.setState({ selectedRecord });
  }

  render = () => {
    const buttons = [
      new RaisedButtonModel({
        label    : 'Delete Record',
        actionID : 'deleteRecord',
        disabled : false
      }),
      new RaisedButtonModel({
        label    : 'Edit Record',
        actionID : 'Edit Record',
        disabled : false
      })
    ];

    const page = {
      title   : 'Absence Records',
      columns : recordsTableColumns,
      buttons
    };


    return (
      <div className="manage-tab">
        <div className="school-select">
          <SchoolSelect
            value={this.state.school}
            schools={this.props.schools}
            changeSchool={this.changeSchool}
          />
        </div>

        {this.state.school
          && <DataTableContainer
            table={this.state.table}
            page={page}
            data={this.props.absenceRecords}
            loaded={this.state.loaded}
            clickHandler={this.clickHandler}
            {...this.props}
          />}

        {/* {this.state.selectedRecord
        && <Paper
          className="record-data"
          zDepth={2}>
            <StudentRecords
              title="Created Students:"
              students={this.state.selectedRecord.createdStudents}
            />
            <StudentRecords
              title="New Missing Students:"
              students={this.state.selectedRecord.newMissingStudents}
            />
          </Paper>} */}

        <DeleteDialog
          dialogOpen={this.state.dialogOpen}
          closeDialog={this.closeDialog}
          removeRecord={this.removeRecord}
        />
      </div>
    );
  }

}

ManageTab.propTypes = {
  actions               : PropTypes.object.isRequired,
  absenceRecords        : PropTypes.instanceOf(List),
  fetchSchoolRecordList : PropTypes.func,
  removeRecord          : PropTypes.func,
  schools               : PropTypes.object
};


function mapStateToProps(state) {
  return {
    absenceRecords : state.absenceRecords,
    schools        : state.schools
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators({
      fetchSchoolRecordList,
      removeRecord,
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageTab);

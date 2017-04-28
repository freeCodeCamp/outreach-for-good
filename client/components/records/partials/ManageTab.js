import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  fetchSchoolRecordList,
  removeRecord} from '../../../modules/absenceRecordReducer';
import DataTable from '../../common/data-table/DataTable';
import RaisedButtonModel from '../../../models/RaisedButtonModel';
import {Link} from 'react-router';
import { List } from 'immutable';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TableModel from '../../../models/TableModel';
import StudentRecords from './StudentRecords';
import Paper from 'material-ui/Paper';
import DeleteDialog from './DeleteDialog';

const table = new TableModel();

class ManageTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // table,
      selectedSchool : null,
      selectedRecord : null,
      dialogOpen     : false,
      loaded         : false
    };

    this.changeSchool = this.changeSchool.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.removeRecord = this.removeRecord.bind(this);
    this.initializeTable = this.initializeTable.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.selectedSchool && nextProps.absenceRecords.size && !this.state.loaded) {
      console.log('Got It!!! ', nextProps.absenceRecords.size);
      //let schoolId = this.state.selectedSchool.get('_id');
      //let nextTable = this.initializeTable(schoolId);
      let nextTable = table.buildIndexMap(this.state.table, nextProps.absenceRecords);

      this.setState({
        table  : nextTable,
        loaded : true
      });
    }
  }

  initializeTable(schoolId) {
    this.props.actions.fetchSchoolRecordList(schoolId);
    let nextTable = table.setSelectedTab(table, 'manage');
    return nextTable;
  }

  /**
   * Updates the data table with selected school
   */
  changeSchool(e, i, selectedSchool) {
    let schoolId = selectedSchool.get('_id');
    let nextTable = this.initializeTable(schoolId);

    this.setState({
      selectedSchool,
      selectedRecord : null,
      table          : nextTable
    });
  }

  /**
   * Handles the clicks on the datatable
   */
  clickHandler(action, data) {
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
      default: {
        this._displayRecord(data);
      }
      }
    }
    }
  }

  removeRecord() {
    let recordId = this.props.absenceRecords.get(0).get('recordId');
    this.props.actions.removeRecord(recordId);
    this.closeDialog();
    this.changeSchool(null, null, this.state.selectedSchool);
  }

  closeDialog() {
    this.setState({ dialogOpen: false });
  }

  /**
  * Display record is used when clicking on a row to display students
  */
  _displayRecord(record) {
    console.log('row clicked: ', record);
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

  render() {
    const selectedSchoolName = this.state.selectedSchool ? this.state.selectedSchool.get('name') : '';

    const buttons = [
      new RaisedButtonModel({
        label    : 'Delete Record',
        actionID : 'deleteRecord',
        disabled : false
      })
    ];

    const page = {
      title   : `${selectedSchoolName} Absence Records`,
      columns : [{
        title : 'Date',
        id    : 'date',
        fixed : true
      }, {
        title    : 'School Year',
        id       : 'schoolYear',
        flexGrow : 1
      }],
      buttons
    };


    return (
      <div className="manage-tab">
        <SelectField
          className="select-school"
          floatingLabelText="Select a school..."
          value={this.state.selectedSchool}
          onChange={this.changeSchool}
          fullWidth={false}
          >
          {this.props.schools.map((school, i) =>
            <MenuItem
              key={i}
              value={school}
              primaryText={school.name} />
            )}
        </SelectField>
        {selectedSchoolName
          && <DataTable
            table={this.state.table}
            page={page}
            data={this.props.absenceRecords.map(record => {
              return {date: record.date, schoolYear: record.schoolYear};
            })}
            loaded={this.state.loaded}
            clickHandler={this.clickHandler}
            {...this.props}
          />}
        {this.state.selectedRecord
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
          </Paper>}
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


import React, {Component, PropTypes} from 'react';
import DataTable from '../../common/data-table/DataTable';
import RaisedButtonModel from '../../../models/RaisedButtonModel';
import {Link} from 'react-router';
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
    };

    this.changeSchool = this.changeSchool.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.removeRecord = this.removeRecord.bind(this);
    this.initializeTable = this.initializeTable.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.selectedSchool) {
      let schoolId = this.state.selectedSchool.get('_id');
      let nextTable = this.initializeTable(schoolId);
      nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecordsList);

      this.setState({ table: nextTable });
    }
  }

  initializeTable(schoolId) {
    this.props.fetchSchoolRecordList(schoolId);
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
    let recordId = this.props.absenceRecordsList.get(0).get('recordId');
    this.props.removeRecord(recordId);
    this.closeDialog();
    this.changeSchool(null, null, this.state.selectedSchool);
  }

  closeDialog() {
    this.setState({ dialogOpen: false });
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
            data={this.props.absenceRecordsList}
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

  /**
   * Display record is used when clicking on a row to display students
   */
  _displayRecord(record) {
    console.log('row clicked: ', record);
    let selectedRecord = {};

    selectedRecord.newMissingStudents = this.props.absenceRecordsList
      .get(record)
      .get('newMissingStudents')
      // .map(entry => entry.get('_id'));
      .map((entry, i) => <Link key={i} to={`/student/${entry.get('_id')}`}>{entry.firstName} {entry.lastName}</Link>);

    selectedRecord.createdStudents = this.props.absenceRecordsList
      .get(record)
      .get('createdStudents')
      .map((entry, i) => <Link key={i} to={`/student/${entry.get('_id')}`}>{`${entry.get('firstName')} ${entry.get('lastName')}`}</Link>);

    this.setState({ selectedRecord });
  }
}

ManageTab.propTypes = {
  absenceRecordsList    : PropTypes.object,
  manageRecords         : PropTypes.object,
  fetchSchoolRecordList : PropTypes.func
};

export default ManageTab;

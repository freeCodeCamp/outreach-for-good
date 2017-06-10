import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  fetchSchoolRecordList,
  removeRecord} from '../../../modules/absenceRecordReducer';
import DataTable from '../../common/data-table/DataTable';
import RaisedButtonModel from '../../../models/RaisedButtonModel';
import {Link} from 'react-router';
import {List} from 'immutable';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TableModel from '../../../models/TableModel';
import StudentRecords from './StudentRecords';
import Paper from 'material-ui/Paper';
import DeleteDialog from './DeleteDialog';

const table = new TableModel();

class ManageTab extends React.Component {
  state = {
    table,
    dialogOpen : false,
    loaded     : false
  };

  componentWillReceiveProps = nextProps => {
    if(this.state.selectedSchool
      && nextProps.absenceRecords.size
      && !this.state.loaded) {
      // Props incoming, ToDo: verify absenceRecords changed
      let nextTable = table.updateSortCol(this.state.table, '');
      nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);

      this.setState({
        table  : nextTable,
        loaded : true
      });
    } else {
      this.setState({
        selectedRecord : null
      });
    }
  }

  /**
   * Updates the data table with selected school
   */
  changeSchool = (e, i, selectedSchool) => {
    let schoolId = selectedSchool.get('_id');
    this.props.actions.fetchSchoolRecordList(schoolId);
    this.setState({
      selectedSchool,
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
      default: {
        this._displayRecord(data);
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
    const selectedSchoolName = this.state.selectedSchool
      ? this.state.selectedSchool.get('name') : '';

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
      }, {
        title    : 'Size',
        id       : 'entries.size',
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
            data={this.props.absenceRecords}
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

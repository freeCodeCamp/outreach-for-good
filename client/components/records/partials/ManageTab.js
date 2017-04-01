import React, {Component, PropTypes} from 'react';
import DataTable from '../../common/data-table/DataTable';
import RaisedButtonModel from '../../../models/RaisedButtonModel';
import {Link} from 'react-router';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// import TableModel from '../../../models/TableModel';
import StudentRecords from './StudentRecords';
import Paper from 'material-ui/Paper';

// const table = new TableModel();

class ManageTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // table,
      selectedSchool : null,
      selectedRecord : null
    };

    this.changeSchool = this.changeSchool.bind(this);
    this.clickRow = this.clickRow.bind(this);
    // this.initializeTable = this.initializeTable.bind(this);
  }

  componentDidMount() {
    let selectedSchool = this.props.schools[0];
    // let nextTable = this.initializeTable();

    this.setState({ selectedSchool });
  }
  //
  // componentWillReceiveProps(nextProps) {
  //   let nextTable = this.state.table;
  //   nextTable = table.updateSortIndex(nextTable, '');
  //   nextTable = table.buildIndexMap(nextTable, nextProps.absenceRecords);
  //
  //   this.setState({
  //     table : nextTable
  //   });
  // }


  changeSchool(e, i, selectedSchool) {
    console.log(selectedSchool._id);
    this.props.fetchSchoolRecordList(selectedSchool._id);
    this.setState({ selectedSchool, selectedRecord: null });
  }

  clickRow(action, data) {
    console.log('row clicked: ', action, data);
    let selectedRecord = {};
    // selectedRecord.updated = this.props.absenceRecordsList
    //   .get(data)
    //   .get('updated')
    //   .map(entry => entry.get('_id'));

    selectedRecord.newMissingStudents = this.props.absenceRecordsList
      .get(data)
      .get('newMissingStudents')
      // .map(entry => entry.get('_id'));
      .map(entry => <Link to={`/student/${entry.get('_id')}`}>{entry.firstName} {entry.lastName}</Link>);

    selectedRecord.createdStudents = this.props.absenceRecordsList
      .get(data)
      .get('createdStudents')
      .map(entry => <Link to={`/student/${entry.get('_id')}`}>{`${entry.get('firstName')} ${entry.get('lastName')}`}</Link>);

    this.setState({ selectedRecord });
  }

  // initializeTable() {
  //   let nextTable;
  //
  //   nextTable = table.setSelectedTab(table, 'manage');
  //   return nextTable;
  // }

  render() {
    const selectedSchoolName = this.state.selectedSchool ? this.state.selectedSchool.get('name') : '';

    const tempClick = () => {
      console.log('clicked');
    };

    const buttons = [
      new RaisedButtonModel({
        label    : 'Delete Record',
        actionID : tempClick
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
        title    : 'Updated',
        id       : 'updated.size',
        flexGrow : 1
      }, {
        title    : 'Created Students',
        id       : 'createdStudents.size',
        flexGrow : 1
      }, {
        title    : 'New Missing Students',
        id       : 'newMissingStudents.size',
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
            page={page}
            data={this.props.absenceRecordsList}
            clickHandler={this.clickRow}
            {...this.props}
          />}
        {this.state.selectedRecord
        && <Paper
          className="record-data"
          zDepth={2}>
            <StudentRecords
              title="Created Students"
              students={this.state.selectedRecord.createdStudents}
            />
            <StudentRecords
              title="New Missing Students"
              students={this.state.selectedRecord.newMissingStudents}
            />
          </Paper>}
      </div>
    );
  }
}

ManageTab.propTypes = {
  absenceRecordsList : PropTypes.object,
  manageRecords      : PropTypes.object
};

export default ManageTab;

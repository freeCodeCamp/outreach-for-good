import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {List} from 'immutable';

import * as recordsActions from '../../../modules/records';
import * as schoolActions from '../../../modules/school';
import * as localActions from '../records.actions';
import * as localDefs from '../records.defs';

import DataTableContainer from '../../../components/data-table/data-table-container';
import DeleteDialog from '../../../components/delete-dialog/delete-dialog';
import SchoolSelect from '../../../components/school-select/school-select';
import StudentRecordTable from '../../../components/student-record-table/student-record-table';

import TableModel from '../../../models/table';

const table = new TableModel();

class ManageTab extends React.Component {
  constructor(props) {
    super(props);

    let nextTable = this.initClickActions(table);
    this.state = {table: nextTable};
  }

  componentDidMount() {
    this.retrieveData('schools');
  }

  componentDidUpdate() {
    while(this.pendingApiCalls.length) {
      this.performApiCall(this.pendingApiCalls.shift());
    }
  }

  pendingApiCalls = [];
  schoolRecords = List([]);

  initClickActions = nextTable => {
    nextTable = table.addPopovers(nextTable, {
      [localActions.SCHOOL] : false
    });
    nextTable = table.addDialogs(nextTable, {
      [localActions.DELETE_RECORD] : false
    });
    return nextTable;
  }

  retrieveData = (data, schoolId) => {
    switch (data) {
    case 'records':
      this.props.recordsActions.fetchSchoolRecordList(schoolId).then(() => this.updateData());
      break;
    case 'schools':
      this.props.schoolActions.getAllSchools().then(() => this.updateData());
      break;
    }
    this.setState({loadResolved: false});
  }

  updateData = nextProps => {
    let schools = {};
    let loadResolved = true;
    schools.available = this.props.schools.map(school => ({name: school.name, id: school._id}))
      .sort((a, b) => a.name > b.name ? 1 : -1);
    schools.selected = this.state.schools && this.state.schools.selected || schools.available.first();
    if(!this.state.schools) {
      this.retrieveData('records', schools.selected.id);
      loadResolved = false;
    } else {
      this.schoolRecords = this.props.records[schools.selected.id];
    }
    let nextTable = this.state.table;
    nextTable = nextTable.updateSortCol(nextTable, '');
    nextTable = nextTable.buildIndexMap(nextTable, this.schoolRecords);
    this.setState({table: nextTable, loadResolved, schools});
  }


  clickHandler = (action, data, event) => {
    let nextTable;
    switch (action) {
    /**
     * DataTable Click Handler
     *   - Select / de-select a table row
     *   - Sort by a column
     *   - Apply a filter
     */
    case 'toggleSelected':
      this.handleToggleSelectedRow(nextTable, data);
      break;
    /**
     * Button / Popover Menu Click Handler
     *   - Typically opens a <Dialog> modal or popover menu
     *   - Initialize dialog and form field parameters
     */
    case 'menuClick':
    case 'buttonClick':
      nextTable = table.setSelectedRowData(this.state.table,
        this.getSelectedRowData());
      if(data == localActions.SCHOOL) {
        this.setState({table: table.handlePopoverButtonClick(nextTable, data, event)});

      } else if(data && data.action == localActions.UPDATE_SCHOOL) {
        this.retrieveData('records', data.id);
        const schools = {...this.state.schools, selected: {name: data.name, id: data.id}};
        nextTable = table.resetPopovers(nextTable);
        this.setState({table: nextTable, schools});

      } else if(data == localActions.DELETE_RECORD) {
        this.pendingApiCalls.push(localActions.DELETE_RECORD);
        this.handleInterfaceButtonClick(nextTable);

      } else {
        this.handleInterfaceButtonClick(nextTable);
      }
      break;
    // Clicked away from popover menu
    case 'popoverClose':
      this.handleClosePopover(this.state.table);
      break;
    }
  } // End of: clickHandler()

  handleToggleSelectedRow = (nextTable, index) => {
    nextTable = table.toggleSingleSelectedRowIndex(this.state.table, index);
    let selectedData = this.getSelectedRowData(nextTable);
    this.setState({table: nextTable, selected: selectedData.first() && selectedData.first().get('recordId')});
  }

  handleInterfaceButtonClick = nextTable => {
    this.handleClosePopover(nextTable);
  }

  handleClosePopover = nextTable => {
    nextTable = table.resetPopovers(nextTable);
    this.setState({table: nextTable});
  }

  // Given a table-row index number, return object containing all row data
  getSelectedRowData = (nextTable = this.state.table) => this.schoolRecords
      .filter((v, i) => nextTable.get('selectedIndex')
      .indexOf(i) != -1);

  render() {
    if(!this.state.schools) {
      return null;
    }
    let buttons = [];

    /**
     * Material-UI <RaisedButton> and <Popover>
     *  - `menu:` become a <Popover> menu under button
     *  - `actionID:` is used by parent to launch dialogs
     *  - See RaisedButtonModel for default parameters
     */
    buttons.push(localDefs.schoolSelectButton(this.state));
    buttons.push(localDefs.deleteRecordButton());

    const pageTitle = this.state.schools && this.state.schools.selected ?
      'Manage Records - ' + this.state.schools.selected.name : 'Manage Records';

    const page = {
      title   : pageTitle,
      columns : localDefs.recordsTableColumns,
      buttons
    };
    console.log(this.props.records.latest[this.state.selected] && this.props.records.latest[this.state.selected].entries);

    return (
      <div>
        {this.state.schools &&
        <DataTableContainer
          page={page}
          data={this.schoolRecords.toList()}
          view = {this.props.viewport}
          table = {this.state.table}
          loaded = {this.state.loadResolved}
          clickHandler = {this.clickHandler}
          withdrawnStudents = {this.props.withdrawnStudents}
        />
        }
        {this.state.selected && this.props.records.latest[this.state.selected] &&
          <StudentRecordTable
            studentRecords={this.props.records.latest[this.state.selected] &&
            this.props.records.latest[this.state.selected].entries}
          />
        }
      </div>
    );
  }
}

ManageTab.propTypes = {
  recordsActions : PropTypes.object.isRequired,
  schoolActions  : PropTypes.object.isRequired,
  records        : PropTypes.object,
  schools        : PropTypes.object,
};


function mapStateToProps(state) {
  return {
    records : state.records,
    schools : state.schools
  };
}

function mapDispatchToProps(dispatch) {
  return {
    recordsActions : bindActionCreators(recordsActions, dispatch),
    schoolActions  : bindActionCreators(schoolActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageTab);

import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {List} from 'immutable';

import * as absenceRecordActions from '../../../modules/absence-record';
import * as schoolActions from '../../../modules/school';
import * as localActions from '../records.actions';
import * as localDefs from '../records.defs';

import DataTableContainer from '../../../components/data-table/data-table-container';
import DeleteDialog from '../../../components/delete-dialog/delete-dialog';
import SchoolSelect from '../../../components/school-select/school-select';


import {
  fetchSchoolRecordList,
  removeRecord } from '../../../modules/absence-record';

import RaisedButtonModel from '../../../models/raised-button';
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

  initClickActions = nextTable => {
    nextTable = table.addPopovers(nextTable, {
      [localActions.UPDATE_SCHOOL] : false
    });
    nextTable = table.addDialogs(nextTable, {
      [localActions.DELETE_RECORD] : false
    });
    return nextTable;
  }

  retrieveData = (data, schoolId) => {
    console.log('retrieveData', data);
    switch (data) {
    case 'absenceRecords':
      this.props.absenceRecordActions.fetchSchoolRecordList(schoolId).then(() => this.updateData());
      break;
    case 'schools':
      this.props.schoolActions.getAllSchools().then(() => this.updateData());
      break;
    }
    this.setState({loadResolved: false});
  }

  updateData = nextProps => {
    console.log('updateData', nextProps);
    let schools = {};
    schools.available = this.props.schools.map(school => ({name: school.name, id: school._id}))
      .sort((a, b) => a.name > b.name ? 1 : -1);
    schools.selected = this.state.schools && this.state.schools.selected || schools.available.first();
    if(!this.state.schools) {
      console.log(schools)
      this.retrieveData('absenceRecords', schools.selected.id);
    }
    let nextTable = this.state.table;
    nextTable = nextTable.updateSortCol(nextTable, '');
    nextTable = nextTable.buildIndexMap(nextTable, this.props.absenceRecords);
    this.setState({table: nextTable, loadResolved: true, schools});
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
      if(data == localActions.UPDATE_SCHOOL) {
        this.setState({table: table.handlePopoverButtonClick(nextTable, data, event)});

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
    nextTable = this._reports.size <= index
      ? table.toggleCollapsedRow(this.state.table, index)
      : table.toggleSelectedRowIndex(this.state.table, index);
    this.setState({table: nextTable});
  }

  handleInterfaceButtonClick = nextTable => {
    this.handleClosePopover(nextTable);
  }

  handleClosePopover = nextTable => {
    nextTable = table.resetPopovers(nextTable);
    this.setState({table: nextTable});
  }

  // Given a table-row index number, return object containing all row data
  getSelectedRowData = () => this.props.absenceRecords
      .filter((v, i) => this.state.table.get('selectedIndex')
      .indexOf(i) != -1);

  render() {
    if(!this.props.schools) {
      return null;
    }
    let viewport = {
      width  : this.props.containerWidth - 20,
      height : this.props.containerHeight - 48 - 80
    };
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

    return (
      <DataTableContainer
        page={page}
        data={this.props.absenceRecords}
        view = {viewport}
        table = {this.state.table}
        loaded = {this.state.loadResolved}
        clickHandler = {this.clickHandler}
        schools = {this.state.schools}
        withdrawnStudents = {this.props.withdrawnStudents}
      />
    );
  }
}

ManageTab.propTypes = {
  absenceRecordActions : PropTypes.object.isRequired,
  schoolActions        : PropTypes.object.isRequired,
  absenceRecords       : PropTypes.instanceOf(List),
  schools              : PropTypes.object,
};


function mapStateToProps(state) {
  return {
    absenceRecords : state.absenceRecords,
    schools        : state.schools
  };
}

function mapDispatchToProps(dispatch) {
  return {
    absenceRecordActions : bindActionCreators(absenceRecordActions, dispatch),
    schoolActions        : bindActionCreators(schoolActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageTab);

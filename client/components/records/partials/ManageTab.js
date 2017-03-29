import React from 'react';
import DataTable from '../../common/data-table/DataTable';
import Dimensions from 'react-dimensions';
import TableModel from '../../../models/TableModel';
import {List} from 'immutable';

const table = new TableModel();
const manageList = new List();
// table.setSelectedTab(table, 'manage');

const ManageTab = ({records, manageView, ...props}) => {
  const page = {
    title   : 'Manage School Absence Records',
    columns : [{
      title : 'Name',
      id    : 'name',
      fixed : true
    }, {
      title    : 'Email Address',
      id       : 'email',
      flexGrow : 1
    }, {
      title    : 'Assigned School',
      id       : 'assignment',
      flexGrow : 1
    }, {
      title    : 'Role',
      id       : 'role',
      flexGrow : 1
    }]
  };
  return (
    <div className="manage-tab">
      <DataTable
        page={page}
        data={manageList}
        table={table}
        view={{
          width  : props.containerWidth - 20,
          height : props.containerHeight - 48 - 80
        }}
        {...props}
      />
    </div>
  );
};

export default Dimensions({elementResize: true})(ManageTab);

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';

import { Cell } from 'fixed-data-table-2';
import { List } from 'immutable';
import * as dataTableActions from './data-table.actions';

import './data-table.scss';
import './data-table-override.scss';

// ToDo: get custom logic (like student ID links, withdrawn styles out via abstractions)

const getColumn = (data, indexMap, rowIndex, col, type) => {
  const record = data.get(indexMap.get(rowIndex));
  if(col === 'student.studentId') {
    return <Link to={`/student/${record.get('student._id')}`}>{record.get(col)}</Link>;
  }

  switch (type) {
  case dataTableActions.FORMAT_DATE:
    return record.get(col);

  case dataTableActions.FORMAT_CHECK:
    return (
      <div style={{textAlign: 'center', width: '100%'}}>
        {record.get(col) ? <i className="fa fa-check" /> : null}
      </div>);

  default:
    return record.get(col);
  }

};

// In the fixed-column configuration, this component generates summary rows
const getFixedColumn = (data, indexMap, rowIndex, col, collapsedColumns) => {
  let value = data.getIn([indexMap.get(rowIndex), col]);
  if(value) {
    return '';
  } else {
    return collapsedColumns.indexOf(indexMap.get(rowIndex)) === -1
      ? <b className="no-select">&#8211;</b>
      : <b className="no-select">+</b>;
  }
};

const DataTableRow = ({rowIndex, indexMap, data, col, type, fixedColumn, collapsedColumns, ...props}) =>
  <Cell {...props} className={
    data.getIn([indexMap.get(rowIndex), 'student.withdrawn']) ? 'withdrawn-student' : null}
  >
  {fixedColumn && col === fixedColumn
    ? getFixedColumn(data, indexMap, rowIndex, col, collapsedColumns)
    : indexMap.size > 0 && data && data.size
        ? getColumn(data, indexMap, rowIndex, col, type)
        : ''
  }
      {/*console.log('Rendering row: ', rowIndex)*/}
  </Cell>
;

DataTableRow.propTypes = {
  rowIndex         : PropTypes.number,
  fixedColumn      : PropTypes.string,
  collapsedColumns : PropTypes.object,
  indexMap         : PropTypes.instanceOf(List).isRequired,
  data             : PropTypes.instanceOf(List).isRequired,
  col              : PropTypes.string.isRequired,
  type             : PropTypes.string,
};

export default DataTableRow;

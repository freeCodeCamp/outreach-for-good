import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import { Cell } from 'fixed-data-table-2';

import { List } from 'immutable';

import './DataTable.scss';
import './DataTableOverride.scss';

const getColumn = (data, indexMap, rowIndex, col) => {
  if(col === 'student.studentId') {
    const studentId = data.get(indexMap[rowIndex]).get('student._id');
    return <Link to={`/student/${studentId}`}>{data.get(indexMap[rowIndex]).get(col)}</Link>;
  } else {
    return data.get(indexMap[rowIndex]).get(col);
  }
};

const DataTableRow = ({rowIndex, indexMap, data, col, ...props}) => <Cell {...props}>
      {indexMap.length > 0 && data && data.size
        // ? data.get(indexMap[rowIndex]).get(col)
        ? getColumn(data, indexMap, rowIndex, col)
        : ''}
      {/*console.log('Rendering row: ', rowIndex)*/}
  </Cell>
          //data.get(rowIndex).get(col)
;

DataTableRow.propTypes = {
  rowIndex : PropTypes.number,
  indexMap : PropTypes.array.isRequired,
  data     : PropTypes.instanceOf(List).isRequired,
  col      : PropTypes.string.isRequired,
};

export default DataTableRow;

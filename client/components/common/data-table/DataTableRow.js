import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table-2';

const DataTableRow = ({rowIndex, data, col, ...props}) =>
    <Cell {...props}>
      {data[rowIndex][col]}
    </Cell>
  ;

DataTableRow.propTypes = {
  rowIndex : PropTypes.number,
  data     : PropTypes.array.isRequired,
  col      : PropTypes.string.isRequired,
};

export default DataTableRow;

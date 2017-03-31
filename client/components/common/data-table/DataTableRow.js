import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table-2';

import { List } from 'immutable';

const DataTableRow = ({rowIndex, indexMap, data, col, ...props}) =>
    <Cell {...props}>
      {/*console.log('Data: ', indexMap, rowIndex, col)*/}
      {indexMap.length > 0
        ? data.get(indexMap[rowIndex]).get(col)
        : data.get(rowIndex).get(col)}
    </Cell>
  ;

DataTableRow.propTypes = {
  rowIndex : PropTypes.number,
  indexMap : PropTypes.array.isRequired,
  data     : PropTypes.instanceOf(List).isRequired,
  col      : PropTypes.string.isRequired,
};

export default DataTableRow;

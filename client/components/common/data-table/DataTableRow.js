import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table-2';

import { List } from 'immutable';

const DataTableRow = ({rowIndex, indexMap, data, col, ...props}) =>
    <Cell {...props}>
      {(indexMap.length > 0 && data && data.size)
        ? data.get(indexMap[rowIndex]).get(col)
        : ''}
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

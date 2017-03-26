import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table-2';

import { List } from 'immutable';

const DataTableRow = ({rowIndex, data, col, ...props}) =>
    <Cell {...props}>
      {/*console.log('Data: ', data.get(rowIndex).get(col), rowIndex, col)*/}
      {data.get(rowIndex).get(col)}
    </Cell>
  ;

DataTableRow.propTypes = {
  rowIndex : PropTypes.number,
  data     : PropTypes.instanceOf(List).isRequired,
  col      : PropTypes.string.isRequired,
};

export default DataTableRow;

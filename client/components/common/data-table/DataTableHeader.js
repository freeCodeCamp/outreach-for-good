import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table-2';

const DataTableHeader = ({...props}) =>
    <Cell {...props}>
      {/*console.log('Data: ', data.get(rowIndex).get(col), rowIndex, col)*/}
      {props.title}
      {/* // This will be the filter for cols
      <br />
      <input type='text' style={{width: '100%'}} />*/}
    </Cell>
  ;

DataTableHeader.propTypes = {
  title : PropTypes.string
};

export default DataTableHeader;

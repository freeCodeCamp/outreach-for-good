import React, { PropTypes } from 'react';
import * as locAct from './localActions';
import { Cell } from 'fixed-data-table-2';

const DataTableHeader = ({id, title, sortCol, sortDir, sortHandler, ...props}) => {
  function clickHandler(event) {
    event.preventDefault();
    sortHandler(event);
  }

  return (
    <Cell className='datatable-header' {...props}>
       <a onClick={clickHandler} id={id}>
        {title}
        {sortCol == id && sortDir ? sortDir === locAct.SORT_DESC ? '↓' : '↑' : ''}
      </a>
    </Cell>
  );
};

DataTableHeader.propTypes = {
  id          : PropTypes.string,
  sortCol     : PropTypes.string,
  sortDir     : PropTypes.string,
  sortHandler : PropTypes.func,
  title       : PropTypes.string
};

export default DataTableHeader;

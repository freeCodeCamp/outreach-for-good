import React from 'react';
import PropTypes from 'prop-types';
import * as locAct from './localActions';
import { Cell } from 'fixed-data-table-2';

import './DataTable.scss';
import './DataTableOverride.scss';

const DataTableHeader = ({id, title, sortCol, sortDir, sortHandler,
  filter, filterHandler, ...props}) => {
  function clickHandler(event) {
    event.preventDefault();
    sortHandler(event);
  }

  const cellClass = filter
    ? 'datatable-header filter-header'
    : 'datatable-header';

  return (
    <Cell className={cellClass} {...props}>
       <a onClick={clickHandler} id={id}>
        {title}
        {sortCol == id && sortDir ? sortDir === locAct.SORT_DESC ? '↓' : '↑' : ''}
      </a>
      {filter && <input
        type='text'
        id={`filter-${id}`}
        style={{width: '100%'}}
        onChange={filterHandler}
        placeholder='filter'
      />}
    </Cell>
  );
};

DataTableHeader.propTypes = {
  filter        : PropTypes.bool,
  filterHandler : PropTypes.func,
  id            : PropTypes.string,
  sortCol       : PropTypes.string,
  sortDir       : PropTypes.string,
  sortHandler   : PropTypes.func,
  title         : PropTypes.string
};

export default DataTableHeader;

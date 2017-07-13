import React from 'react';
// import PropTypes from 'prop-types';

import SimpleTable from '../../../components/simple-table/simple-table';

const columns = [
  'Category',
  'COUNT',
  'SUM'
];

const simpleTableData = [
  ['Student Hours', 0, 0],
  ['Family Hours'],
  ['Community Hours'],
  ['Volunteer Hours'],
  ['Total family volunteers']
];

const Overview = () =>
  <SimpleTable
    columns={columns}
    data={simpleTableData}
  />;

// Overview.propTypes = {
//
// }

export default Overview;

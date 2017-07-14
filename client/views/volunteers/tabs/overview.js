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
  ['Family Hours', 0, 0],
  ['Community Hours', 0, 0],
  ['Volunteer Hours', 0, 0],
  ['Total family volunteers', 0, 0]
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

import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import DataTableRow from './DataTableRow';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const DataTable = ({page, table, column, data, ...props}) => {
  if(!page.button) page.button = [];

  return (
    <div className="admin-page-tab">
      <div className="admin-page-title">
        <h3>{page.title}</h3>
        <div className="buttons">
          {page.button.map((button, index) =>
            <RaisedButton
              label={button.label}
              primary={button.primary || false}
              secondary={button.secondary || false}
              disabled
              key={index}
            />
            )}
        </div>
      </div>
      <Paper className="display-paper">
        <Table
          rowHeight={table.rowHeight || 30}
          headerHeight={table.headerHeight || 30}
          rowsCount={data.length}
          width={table.width}
          height={table.height}
          onRowClick={props.onRowClick}
          rowClassNameGetter={function(i) {
            if(i === 1) {
              return 'MakeItBlue';
            }
          }}
        >
        {column.map(col =>
          <Column
            header={<Cell>{col.title}</Cell>}
            cell={<DataTableRow data={data} col={col.id} />}
            fixed={col.fixed}
            flexGrow={col.flexGrow}
            key={col.id}
            width={col.width || 200}
          />
          )}
        </Table>
      </Paper>
    </div>
  );
};

DataTable.propTypes = {
  page       : PropTypes.object.isRequired,
  table      : PropTypes.object.isRequired,
  column     : PropTypes.array.isRequired,
  data       : PropTypes.array.isRequired,
  onRowClick : PropTypes.func
};

export default DataTable;

import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import DataTableRow from './DataTableRow';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const DataTable = ({page, table, column, data, ...props}) => {
  if(!page.button) page.button = [];

  let row = {
    selected : props.tableState,
    isSelected(index) {
      return row.selected.indexOf(index) !== -1
        ? 'selected-row' : '';
    },
    toggleSelected(event, index) {
      let location = row.selected.indexOf(index);
      location === -1 ? row.selected.push(index)
        : row.selected.splice(location, 1);
      props.callback('toggleSelected', row.selected);
    }
  };

  function buttonHandler() {
    props.callback('buttonClick', this.value); // eslint-disable-line no-invalid-this
  }

  return (
    <div className="admin-page-tab">
      <div className="admin-page-title">
        <h3>{page.title}</h3>
        <div className="buttons">
          {page.button.map((button, index) =>
            <RaisedButton
              label={button.label}
              value={button.label}
              primary={button.primary || false}
              secondary={button.secondary || false}
              disabled={row.selected.length == 0}
              onClick={buttonHandler}
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
          onRowClick={row.toggleSelected}
          rowClassNameGetter={row.isSelected}
        >
        {column.map(col =>
          <Column
            header={
              <Cell>
                {col.title}
                {/*<br />
                <input type='text' style={{width: '100%'}} />*/}
              </Cell>
              }
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
  tableState : PropTypes.array
};

export default DataTable;

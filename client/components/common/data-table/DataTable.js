import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import DataTableRow from './DataTableRow';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import Dialog from 'material-ui/Dialog';

const DataTable = ({page, table, column, data, ...props}) => {
  if(!page.button) page.button = [];

  let row = {
    selected : props.selectedRows,
    isSelected(index) {
      return row.selected.indexOf(index) !== -1
        ? 'selected-row' : '';
    },
    toggleSelected(event, index) {
      let location = row.selected.indexOf(index);
      location === -1 ? row.selected.push(index)
        : row.selected.splice(location, 1);
      props.clickHandler('toggleSelected', row.selected);
    }
  };

  function buttonHandler(event) {
    event.preventDefault();
    //console.log(event);
    props.clickHandler('buttonClick', this.value, event); // eslint-disable-line no-invalid-this
  }

  function menuItemHandler(event) {
    event.preventDefault();
    props.clickHandler('menuClick', this.value, event); // eslint-disable-line no-invalid-this
  }

  function popoverClose() {
    props.clickHandler('popoverClose', this.value); // eslint-disable-line no-invalid-this
  }

  return (
    <div className="admin-page-tab">
      <div className="admin-page-title">
        <h3>{page.title}</h3>
        <div className="buttons">
          {page.raisedButtons && page.raisedButtons
            .map((button, index) =>
            <div key={index} style={{display: 'inline'}}>
              <RaisedButton
                label={button.label}
                labelColor={button.labelColor}
                value={button.triggerID || ''}
                primary={button.primary || false}
                secondary={button.secondary || false}
                backgroundColor={button.backgroundColor}
                style={{marginLeft: '10px'}}
                disabled={row.selected.length == 0}
                onClick={buttonHandler}
              />
              {button.menu
                && <Popover
                  open={button.menu.open}
                  anchorEl={props.openMenus.anchor}
                  anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  onRequestClose={popoverClose}
                >
                  <Menu>
                    {button.menu.item.map((item, i) =>
                      <MenuItem
                        primaryText={item.text}
                        value={item.triggerID}
                        onTouchTap={menuItemHandler}
                        key={i}
                      />
                    )}
                  </Menu>
                </Popover>
              }
            </div>
            )}
          {page.dialogs && page.dialogs
            .map((dialog, index) =>
              <Dialog
                title={dialog.title}
                actions={dialog.actions}
                modal
                open={dialog.open}
                key={index}
              >
                Only actions can close this dialog.
              </Dialog>
            )}
        </div>
      </div>
      <Paper className="display-paper">
        <Table
          rowHeight={table.rowHeight || 30}
          headerHeight={table.headerHeight || 30}
          rowsCount={data.length}
          width={table.width}
          maxHeight={table.maxHeight}
          onRowClick={row.toggleSelected}
          rowClassNameGetter={row.isSelected}
        >
        {column
          .map(col =>
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
  page         : PropTypes.object.isRequired,
  table        : PropTypes.object.isRequired,
  column       : PropTypes.array.isRequired,
  data         : PropTypes.array.isRequired,
  selectedRows : PropTypes.array
};

export default DataTable;

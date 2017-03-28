import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import DataTableHeader from './DataTableHeader';
import DataTableRow from './DataTableRow';

import { List } from 'immutable';
import TableModel from '../../../models/TableModel';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import Dialog from 'material-ui/Dialog';

const DataTable = ({page, table, data, ...props}) => {
  // Highlight selected rows and handle row clicks
  let row = {
    selected : table.get('selectedIndex'),
    isSelected(index) {
      return row.selected.includes(index)
        ? 'selected-row' : '';
    },
    toggleSelected(event, index) {
      props.clickHandler('toggleSelected', index);
    }
  };

  /**
   * DataTable Handler
   *   - Catch events from the table and send to parent component
   */
  function tableSortHandler(event) {
    console.log(event.target.id)
    props.clickHandler('toggleSortCol', event.target.id);
  }

  /**
   * Handler Functions
   *   - Catch events from page elements and send to parent component
   */
  function buttonHandler(event) {
    event.preventDefault();
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
          {page.buttons && page.buttons
            .map((button, index) =>
            <div key={index} style={{display: 'inline'}}>
              <RaisedButton
                label={button.get('label')}
                labelColor={button.get('labelColor')}
                value={button.get('actionID') || ''}
                primary={button.get('primary') || false}
                secondary={button.get('secondary') || false}
                backgroundColor={button.get('backgroundColor')}
                style={{marginLeft: '10px'}}
                disabled={row.selected.size == 0 && button.get('disabled')}
                onClick={buttonHandler}
              />
              {button.get('menu').open
                && <Popover
                  open={button.get('menu').open}
                  anchorEl={table.get('MuiAnchor')}
                  anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  onRequestClose={popoverClose}
                >
                  <Menu>
                    {button.get('menu').item.map((item, i) =>
                      <MenuItem
                        primaryText={item.text}
                        value={item.actionID}
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
                title={dialog.get('title')}
                actions={dialog.get('actions')
                  .map((v, i) => dialog.getActionButton(
                    v.label, v.click, i, v.value, v.disabled
                  ))
                }
                modal
                open={dialog.get('open')}
                onRequestClose={popoverClose}
                key={index}
                titleClassName='dialog-title'
                bodyClassName='dialog-body'
                contentClassName='dialog-content'
              >
                {dialog.text}
              </Dialog>
            )}
        </div>
      </div>
      <Paper className="display-paper">
        <Table
          rowHeight={table.get('rowHeight') || 30}
          headerHeight={table.get('headerHeight') || 30}
          rowsCount={data.size}
          width={props.view.width}
          maxHeight={props.view.height}
          onRowClick={row.toggleSelected}
          rowClassNameGetter={row.isSelected}
        >
        {page.columns && page.columns
          .map(col =>
          <Column
            header={
              <DataTableHeader
                id={col.id}
                title={col.title}
                sortCol={table.get('sortIndex')}
                sortDir={table.get('sortDirection')}
                sortHandler={tableSortHandler}
              />
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
  view         : PropTypes.object.isRequired,
  page         : PropTypes.object.isRequired,
  table        : PropTypes.instanceOf(TableModel).isRequired,
  data         : PropTypes.instanceOf(List).isRequired,
  selectedRows : PropTypes.object
};

export default DataTable;

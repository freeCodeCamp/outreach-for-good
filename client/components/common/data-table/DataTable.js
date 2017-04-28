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
import Divider from 'material-ui/Divider';

import Dialog from 'material-ui/Dialog';

const DataTable = ({page, table, data, ...props}) => {
  /**
   * DataTable Handler
   *   - Catch events from the table and send to parent component
   */
  const selectedRows = table.selectionToMappedIndicies(table);

  const isRowSelected = index =>
    selectedRows.includes(index) ? 'selected-row' : '';

  function rowToggleSelected(event, index) {
    props.clickHandler('toggleSelected', index);
  }

  function tableSortHandler(event) {
    props.clickHandler('toggleSortCol', event.target.id);
  }

  function tableFilterHandler(event) {
    props.clickHandler('changeFilterCol', event.target.id, event.target.value);
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
                disabled={selectedRows.size == 0 && button.get('disabled')}
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
                      item.text == 'Divider'
                      ? <Divider key={`menu-item-${item.text}-${i}`} />
                      : <MenuItem
                        primaryText={item.text}
                        value={item.actionID}
                        onTouchTap={menuItemHandler}
                        key={`menu-item-${item.text}-${i}`}
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
          headerHeight={table.get('filterEnabled')
            ? table.get('filterHeaderHeight') || 60
            : table.get('headerHeight') || 30}
          rowsCount={props.loaded
            ? table.get('indexMap').length : 1}
          width={props.view.width || 100}
          maxHeight={props.view.height}
          onRowClick={rowToggleSelected}
          rowClassNameGetter={isRowSelected}
        >
        {/*console.log('Debugging race condition: ', data, page.columns)*/}
        {page.columns && page.columns
          .map(col =>
          <Column
            header={
              <DataTableHeader
                filter={table.get('filterEnabled')}
                filterHandler={tableFilterHandler}
                id={col.id}
                sortCol={table.get('sortCol')}
                sortDir={table.get('sortDirection')}
                sortHandler={tableSortHandler}
                title={col.title}
              />
              }
            cell={
              props.loaded
              ? <DataTableRow
                indexMap={table.get('indexMap')}
                data={data}
                col={col.id}
              />
              : <Cell className="cell-loading">
                  <i className="fa fa-refresh fa-spin" />
                </Cell>
              }
            fixed={col.fixed}
            flexGrow={col.flexGrow}
            key={col.id}
            width={col.width || 200}
          />
          )}
          {/*console.log('Debugging race condition: ', data.toJS())*/}
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
  loaded       : PropTypes.bool,
  selectedRows : PropTypes.object
};

export default DataTable;

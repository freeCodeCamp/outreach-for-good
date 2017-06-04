import React, { PropTypes } from 'react';
import TableContainer from './TableContainer';

import TableModel from '../../../models/TableModel';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import Dialog from 'material-ui/Dialog';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.selectedRows = this.props.table.selectionToMappedIndicies(this.props.table);
  }
  /**
   * Handler Functions
   *   - Catch events from page elements and send to parent component
   */
  buttonHandler = (event, value) => {
    event.preventDefault();
    this.props.clickHandler('buttonClick', value, event);
  }

  menuItemHandler = event => {
    event.preventDefault();
    this.props.clickHandler('menuClick', this.value, event); // eslint-disable-line babel/no-invalid-this
  }

  popoverClose = () => {
    this.props.clickHandler('popoverClose', this.value); // eslint-disable-line babel/no-invalid-this
  }

  render() {
    const {
      page,
      table
    } = this.props;
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
                  disabled={this.selectedRows.size == 0 && button.get('disabled')}
                  onClick={e => this.buttonHandler(e, button.get('actionID') || '')} // eslint-disable-line react/jsx-no-bind
                />
                {button.get('menu').open
                  && <Popover
                    open={button.get('menu').open}
                    anchorEl={table.get('MuiAnchor')}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    onRequestClose={this.popoverClose}
                  >
                    <Menu>
                      {button.get('menu').item.map((item, i) =>
                        item.text == 'Divider'
                        ? <Divider key={`menu-item-${item.text}-${i}`} />
                        : <MenuItem
                          primaryText={item.text}
                          value={item.actionID}
                          onTouchTap={this.menuItemHandler}
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
                  onRequestClose={this.popoverClose}
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
          <TableContainer page={page} table={table} {...this.props} />
        </Paper>
      </div>
    );
  }
}

DataTable.propTypes = {
  clickHandler : PropTypes.func.isRequired,
  page         : PropTypes.object.isRequired,
  table        : PropTypes.instanceOf(TableModel).isRequired,
  selectedRows : PropTypes.object
};

export default DataTable;

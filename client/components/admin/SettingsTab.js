import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as settingsActions from '../../modules/settingsReducer';
import DialogModal from '../common/DialogModal';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import './SettingsTab.scss';

class SettingsTab extends Component {
  state = {
    open : false,
    row  : []
  }

  componentDidMount = () => {
    this.props.actions.getInterventionTypes();
  }

  handleClose = e => {
    console.log(e.target);
    this.setState({ open: !this.state.open });
  }

  handleSubmit = e => {
    console.log(e);
  }

  handleRowSelect = row => {
    this.setState({ row: row[0] });
  }

  getModalContent = () => {
    let props = {};
    props.title = 'This is the title';
    props.open = this.state.open;
    props.handleClose = this.handleClose;
    props.handleSubmit = this.handleSubmit;

    return props;
  }

  render = () => {
    const settings = this.props.settings.interventionTypes;

    return (
      <div className="settings-tab">
        <h3>Settings</h3>
        <div className="controls">
          <RaisedButton
            className="control-btn"
            icon={<FontIcon className="fa fa-plus" />}
            label="Add New Intervention Type"
            onTouchTap={() => this.setState({ open: !this.state.open})}
            primary
          />

          <RaisedButton
            className="control-btn"
            icon={<FontIcon className="fa fa-pencil-square-o" />}
            label="Edit Intervention Type"
            onTouchTap={() => console.log('open for edit')}
            disabled={!this.state.hasOwnProperty('row')}
          />
        </div>

        <Table onRowSelection={this.handleRowSelect}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Title</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.map((setting, i) =>
              <TableRow key={i}>
                <TableRowColumn>{setting.title}</TableRowColumn>
                <TableRowColumn>{setting.description}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DialogModal modalContent={this.getModalContent} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings : state.settings
});

const mapDispatchToProps = dispatch => ({
  actions : bindActionCreators(settingsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsTab);

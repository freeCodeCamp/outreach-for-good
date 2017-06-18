import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as settingsActions from '../../../modules/settings';

import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn } from 'material-ui/Table';

import DialogModal from '../../../components/dialog-modal/dialog-modal';

import './settings.scss';

class SettingsTab extends React.Component {
  state = {
    openAdd  : false,
    openEdit : false
  }

  componentDidMount = () => {
    this.props.actions.getInterventionTypes();
  }

  handleClose = e => {
    this.setState({ openAdd: false, openEdit: false});
  }

  handleRowSelect = row => {
    const {interventionTypes} = this.props.settings;

    this.setState({ row: interventionTypes[row[0]] });
  }

  handleSubmit = e => {
    e.preventDefault();
    switch (e.target.name) {
    case 'add':
      this.props.actions.postInterventionType({
        title       : e.target.interventionTitle.value,
        description : e.target.interventionDescription.value
      });
      break;
    case 'edit':
      const typeId = e.target.interventionId.value;

      this.props.actions.putInterventionType(typeId, {
        title       : e.target.interventionTitle.value,
        description : e.target.interventionDescription.value
      });
      break;
    default: break;
    }

    this.handleClose();
  };

  handleDelete = e => {
    console.log(e.target);
  }

  render = () => {
    const { interventionTypes } = this.props.settings;

    return (
      <div className="settings-tab">
        <div className="title-controls">
          <h3>Settings</h3>
          <RaisedButton
            className="control-btn"
            icon={<FontIcon className="fa fa-plus" />}
            label="Add New"
            onTouchTap={() => this.setState({ openAdd: !this.state.openAdd})}
            disabled={this.state.row !== undefined}
            primary
          />

          <RaisedButton
            className="control-btn"
            icon={<FontIcon className="fa fa-pencil-square-o" />}
            label="Edit"
            onTouchTap={() => this.setState({ openEdit: !this.state.openEdit})}
            disabled={!(this.state.row !== undefined)}
          />

          <RaisedButton
            className="control-btn"
            icon={<FontIcon className="fa fa-trash" />}
            label="Delete"
            onTouchTap={this.handleDelete}
            disabled={!(this.state.row !== undefined)}
          />
        </div>

        <Table
          className="intervention-table"
          onRowSelection={this.handleRowSelect}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Title</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody deselectOnClickaway={false}>
            {interventionTypes.map((setting, i) =>
              <TableRow key={i}>
                <TableRowColumn>{setting.title}</TableRowColumn>
                <TableRowColumn>{setting.description}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DialogModal
          name="add"
          title={'Create a new intervention type'}
          open={this.state.openAdd}
          handleSubmit={this.handleSubmit}
          handleClose={this.handleClose}
        />

        <DialogModal
          name="edit"
          title={'Edit intervention type'}
          open={this.state.openEdit}
          intervention={this.state.row}
          handleSubmit={this.handleSubmit}
          handleClose={this.handleClose}
        />
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

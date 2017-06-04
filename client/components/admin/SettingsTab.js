import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as settingsActions from '../../modules/settingsReducer';
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

  componentDidMount() {
    this.props.actions.getInterventionTypes();
  }

  render() {
    const settings = this.props.settings.interventionTypes;

    return (
      <div className="settings-tab">
        <div className="controls">
          <h3>Settings</h3>
          <RaisedButton
            icon={<FontIcon className="fa fa-plus" />}
            label="Add New Intervention Type"
            primary />
        </div>
        <Table>
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

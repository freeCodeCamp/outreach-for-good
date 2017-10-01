import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'material-ui/DatePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import StudentNotes from '../student-notes/student-notes';
import StudentDialog from '../../components/student-dialog/student-dialog';
import { formatDate } from '../../utils/date';
import './student-interventions.scss';

class StudentInterventions extends React.Component {
  state = {
    datePickers : {},
    menuOpen    : false,
    dialogOpen  : false,
    selectedInterventionId: this.props.settings.interventionTypes[0]._id,
    selectedInterventionType: this.props.settings.interventionTypes[0].title,
    showArchive: false
  }

  handleInterventionNote = (note, interventionId) => {
    this.props.clickHandler('addInterventionNote', interventionId, {note});
  };

  handleNewIntervention = () => {
    this.props.clickHandler('addIntervention', this.state.selectedInterventionType);
    this.setState({ dialogOpen: false });
  };

  updateData = i => {
    console.log('intervention-date-picker-' + i);
    this.state.datePickers[i].focus();
  };

  handleMenuOpen = event => {
    event.preventDefault();
    this.setState({menuOpen: true, anchorEl: event.currentTarget});
  };

  handleMenuClose = () => {
    this.setState({menuOpen: false});
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true, menuOpen: false });
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  }

  handleInterventionChange = (event, key, value) => {
    this.setState({
      selectedInterventionId: value,
      selectedInterventionType: this.props.settings.interventionTypes.filter(i => i._id == value)[0].title
    });
  }

  handleArchiveIntervention = id => {
    this.props.clickHandler('archiveIntervention', id);
  }

  handleUnArchiveIntervention = id => {
    this.props.clickHandler('unArchiveIntervention', id);
  }

  handleToggleShowArchived = () => {
    this.setState({ showArchive: !this.state.showArchive, menuOpen: false });
  }

  handleDeleteIntervention = id => {
    this.props.clickHandler('deleteIntervention', id);
  }

  render() {
    const interventions = this.state.showArchive ?
      this.props.interventions : this.props.interventions.filter(i => !i.archived);
    return (
      <div className="intervention-container container-fluid">
        {interventions.map((intervention, i) =>
        <div
          className={classnames('student-row', {row: i % 2 !== 0})}
          key={'intervention-' + intervention._id}
        >
          <div className={classnames("col-data col-md-6", {'last-intervention-row': (i === this.props.interventions.length - 1 && i % 2 === 0)})}>
            <div className={classnames('col-heading', {'archived-intervention': intervention.archived})}>
              {intervention.type} &nbsp; 
              <span className="absence-annotation">
                ({formatDate(new Date(intervention.createdDate))})
              </span>
              <span style={{float: 'right', color: '#31708f', cursor: 'pointer'}}>
                <i className="fa fa-archive" onClick={() => intervention.archived ? this.handleUnArchiveIntervention(intervention._id) : this.handleArchiveIntervention(intervention._id)}/>
                { intervention.archived &&
                 <i className="fa fa-trash archive-remove" onClick={() => this.handleDeleteIntervention(intervention._id)}/>
                }
              </span>
            </div>
            <div className="intervention-card">
              <div className="intervention-notes">
                <StudentNotes
                  handleNewNote={this.handleInterventionNote}
                  notes={intervention.notes}
                  actionId={intervention._id}
                />
              </div>
            </div>
          </div>
        </div>)}
        {this.props.selectedTab === 'interventions' &&
          <div>
            <FloatingActionButton
              mini={true}
              className="floating-button"
              onClick={this.handleMenuOpen}
            >
              <ContentAdd />
            </FloatingActionButton>
            <Popover
              open={this.state.menuOpen}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleMenuClose}
            >
              <Menu>
                <MenuItem
                  primaryText="Create New Intervention"
                  onClick={this.handleDialogOpen}
                />
                <MenuItem
                  primaryText={
                    <div>
                      <i className={classnames('fa', {'fa-check-square-o': this.state.showArchive}, {'fa-square-o': !this.state.showArchive})} />
                      &nbsp; Archived Interventions
                    </div>
                  }
                  onClick={this.handleToggleShowArchived}
                />
              </Menu>
            </Popover>
        </div>
      }
      { this.props.settings &&
        <Dialog
          title={'New Intervention'}
          actions={[
            <FlatButton
              label='Cancel'
              primary
              onClick={this.handleDialogClose}
              disabled={false}
            />,
            <FlatButton
              label='Add'
              primary
              onClick={this.handleNewIntervention}
              value='NEW_INTERVENTION'
              disabled={false}
            />]}
          modal
          open={this.state.dialogOpen}
          onRequestClose={this.handleDialogClose}
          titleClassName='dialog-title'
          bodyClassName='dialog-body'
          contentClassName='dialog-content'
        >
          <div>
          Select an Intervention Type
          <br />
          <div style={{textAlign: 'center'}}>
            <DropDownMenu
              value={this.state.selectedInterventionId}
              onChange={this.handleInterventionChange}
            >
              {this.props.settings.interventionTypes.map(item =>
                <MenuItem
                  value={item._id}
                  primaryText={item.title}
                  key={item._id}
                />
              )}
            </DropDownMenu>
            </div>
          </div>
        </Dialog>
      }
      </div>
    );
  }
}

StudentInterventions.propTypes = {
  interventions : PropTypes.array,
  settings      : PropTypes.object,
  selectedTab   : PropTypes.string,
  clickHandler  : PropTypes.func
};

export default StudentInterventions;

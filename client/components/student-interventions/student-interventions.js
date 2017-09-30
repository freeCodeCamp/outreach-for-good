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

import StudentNotes from '../student-notes/student-notes';
import StudentDialog from '../../components/student-dialog/student-dialog';
import { formatDate } from '../../utils/date';
import './student-interventions.scss';

class StudentInterventions extends React.Component {
  state = {
    datePickers : {},
    menuOpen    : false,
    dialogOpen  : false
  }

  handleInterventionNote = (note, interventionId) => {
    this.props.clickHandler('addInterventionNote', interventionId, {note});
  };

  handleNewIntervention = (note, interventionId) => {
    this.props.clickHandler('addIntervention', interventionId, {note});
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
    this.setState({ dialogOpen: true });
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  }

  render() {
    return (
      <div className="intervention-container container-fluid">
        {this.props.interventions.map((intervention, i) =>
        !intervention.archived &&
        <div
          className={classnames('student-row', {row: i % 2 !== 0})}
          key={'intervention-' + intervention._id}
        >
          <div className={classnames("col-data col-md-6", {'last-intervention-row': (i === this.props.interventions.length - 1 && i % 2 === 0)})}>
            <div className="col-heading">
              {intervention.type} &nbsp; 
              <span className="absence-annotation">
                ({formatDate(new Date(intervention.createdDate))})
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
                />
              </Menu>
            </Popover>
        </div>
      }
      { this.props.settings &&
        <Dialog
          title={'New Intervention'}
          actions={dialog.get('actions')
            .map((v, i) => dialog.getActionButton(
              v.label, v.click, i, v.value, v.disabled
            ))
          }
          modal
          open={this.state.dialogOpen}
          onRequestClose={this.handleDialogClose}
          key={index}
          titleClassName='dialog-title'
          bodyClassName='dialog-body'
          contentClassName='dialog-content'
        >
          <div>
          Select an Intervention Type
          <br />
          <div style={{textAlign: 'center'}}>
            <DropDownMenu
              value={currentState.get('selected')}
              onChange={currentState.get('onChange')}
              key={key}
            >
              {currentState.get('items').map(item =>
                <MenuItem
                  value={item}
                  primaryText={item}
                  key={item}
                />
              )}
            </DropDownMenu>
          </div></div>
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

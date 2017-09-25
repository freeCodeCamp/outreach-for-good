import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'material-ui/DatePicker';
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

  datePickerClick = i => {
    this.state.datePickers[i].focus();
  };

  datePickerChange = (date, interventionId) => {
    this.props.clickHandler('updateinterventionAction', interventionId, {actionDate: date.toString()});
  };

  handleinterventionNote = (note, interventionId) => {
    this.props.clickHandler('addinterventionNote', interventionId, {note});
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
        <div
          className={classnames('student-row', {row: i % 2 !== 0})}
          key={'intervention-' + intervention._id}
        >
          <div className={classnames("col-data col-md-6", {'last-intervention-row': (i === this.props.interventions.length - 1 && i % 2 === 0)})}>
            <div className="col-heading">
              {intervention.type + ' #' + intervention.tier}
              &nbsp;
              <span className="absence-annotation">
                ({intervention.absences} Absences)
              </span>
            </div>
            <div className="intervention-card">
              <div className="intervention-info">
                <div className="intervention-info-label">Trigered</div>
                <div className="intervention-info-data">{formatDate(new Date(intervention.triggerDate))}</div>
                <div className="intervention-info-label">
                  Action Taken <i className="fa fa-calendar" onClick={() => this.datePickerClick(i)}/>
                </div>
                <DatePicker
                  onChange={(e, date) => this.datePickerChange(date, intervention._id)}
                  ref={(input) => { this.state.datePickers[i] = input; }}
                  id={"intervention-date-picker-" + i}
                  style={{visibility: 'hidden', width: 1, height: 1}}
                />
                <div className="intervention-info-data">{intervention.actionDate && formatDate(new Date(intervention.actionDate))}&nbsp;</div>
              </div>
              <div className="intervention-notes">
                <StudentNotes
                  handleNewNote={this.handleinterventionNote}
                  notes={intervention.notes}
                  interventionId={intervention._id}
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
                  onClick={this.dialogOpen}
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
        <StudentDialog
          data={this.props.settings.interventionTypes}
          dialogOpen={this.state.dialogOpen}
          dialogClose={this.dialogClose}
          dialogSubmit={null} //this.props.studentActions.postIntervention
        />
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

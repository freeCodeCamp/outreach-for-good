import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import StudentNotes from '../student-notes/student-notes';

import { formatDate } from '../../utils/date';
import './student-notes-page.scss';
class StudentNotesPage extends React.Component {
  state = {
    menuOpen    : false,
    showArchive: false
  }

  handleMenuOpen = event => {
    event.preventDefault();
    this.setState({menuOpen: true, anchorEl: event.currentTarget});
  };

  handleMenuClose = () => {
    this.setState({menuOpen: false});
  };

  handleToggleShowArchived = () => {
    this.setState({ showArchive: !this.state.showArchive, menuOpen: false });
  }

  handleNewStudentNote = note => {
    this.props.clickHandler('addStudentNote', {note});
  }

  handleArchiveClick = id => {
    this.props.clickHandler('archiveStudentNote', id);
  }

  handleUnArchiveClick = id => {
    this.props.clickHandler('unArchiveStudentNote', id);
  }

  handleDeleteClick = id => {
    this.props.clickHandler('deleteStudentNote', id);
  }

  render() {
    return (
      <div>
        <StudentNotes
          handleNewNote={this.handleNewStudentNote}
          notes={this.props.notes}
          actionId={'STUDENT_NOTE'}
          showArchive={this.state.showArchive}
          handleArchiveNote={this.handleArchiveClick}
          handleUnArchiveNote={this.handleUnArchiveClick}
          handleDeleteNote={this.handleDeleteClick}
        />
        {this.props.selectedTab === 'notes' &&
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
                  primaryText={
                    <div>
                      <i className={classnames('fa', {'fa-check-square-o': this.state.showArchive}, {'fa-square-o': !this.state.showArchive})} />
                      &nbsp; Archived Notes
                    </div>
                  }
                  onClick={this.handleToggleShowArchived}
                />
              </Menu>
            </Popover>
        </div>
      }
      </div>
    );
  }
}

StudentNotesPage.propTypes = {
  notes         : PropTypes.array,
  selectedTab   : PropTypes.string,
  clickHandler : PropTypes.func
};

export default StudentNotesPage;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { formatDate } from '../../utils/date';
import './student-notes.scss';
class StudentNotes extends React.Component {
  input;

  state = {
    enableActions: !!(this.props.handleArchiveNote && this.props.handleUnArchiveNote && this.props.handleDeleteNote),
    openNoteActions: {}
  }

  handleNoteClick = id => {
    if(!this.state.enableActions) {
      return;
    }
    const openNoteActions = this.state.openNoteActions;
    openNoteActions[id] = !openNoteActions[id];
    this.setState({openNoteActions});
  }

  render() {
    const enableActions = this.state.enableActions;
    const notes = this.props.showArchive ? this.props.notes : this.props.notes.filter(n => !n.archived);
    return (
      <div className="notes-container">
        <div className="add-notes">
          <div className="add-notes-label">
            <span style={{position: 'absolute', right: 10, bottom: 2}}>
              Notes
            </span>
          </div>
          <div className="add-notes-input">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                ref={input => {this.input = input; }}
              />
              <span className="input-group-btn">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    this.props.handleNewNote(this.input.value, this.props.actionId);
                    this.input.value = '';
                  }}
                >
                  +
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="note-list">
          {notes.map((note, i) =>
            <div className={classnames('note-line', {'archived-note': note.archived})} key={note._id}>
              <span className={classnames('note-date', {'note-pointer': enableActions})} onClick={() => this.handleNoteClick(note._id)}>
                {formatDate(new Date(note.date || note.updatedAt))}
              </span> &nbsp;
              {this.state.openNoteActions[note._id] &&
              <span>
                {note.archived ?
                  <span>
                    <i className="fa fa-archive" style={{cursor: 'pointer', color: 'rgb(49, 112, 143)'}} onClick={() => this.props.handleUnArchiveNote(note._id)} />  &nbsp;
                    <i className="fa fa-trash" style={{cursor: 'pointer', color: '#a94442'}} onClick={() => this.props.handleDeleteNote(note._id)} />
                  </span> :
                  <i className="fa fa-archive" style={{cursor: 'pointer', color: 'rgb(49, 112, 143)'}} onClick={() => this.props.handleArchiveNote(note._id)}/>
                }
                &nbsp; &nbsp;
              </span>
              }
              {note.note}
              {i !== this.props.notes.length - 1 && <hr />}
            </div>
          )}
        </div>
      </div>
    );
  }
}

StudentNotes.propTypes = {
  actionId    : PropTypes.string,
  notes         : PropTypes.array,
  handleNewNote : PropTypes.func,
  handleArchiveNote : PropTypes.func,
  handleUnArchiveNote : PropTypes.func,
  handleDeleteNote : PropTypes.func,
  showArchive: PropTypes.bool
};

export default StudentNotes;

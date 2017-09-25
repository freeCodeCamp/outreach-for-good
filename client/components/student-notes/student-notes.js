import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from '../../utils/date';
import './student-notes.scss';
class StudentNotes extends React.Component {
  input;
  render() {
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
                    this.props.handleNewNote(this.input.value, this.props.outreachId);
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
          {this.props.notes.map((note, i) =>
            <div className="note-line" key={note._id}>
              <span className="note-date">{formatDate(new Date(note.date || note.updatedAt))}</span> &nbsp;
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
  outreachId    : PropTypes.string,
  notes         : PropTypes.array,
  handleNewNote : PropTypes.func
};

export default StudentNotes;

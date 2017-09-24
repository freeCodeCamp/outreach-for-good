import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from '../../utils/date';
import './student-notes.scss';

const StudentNotes = ({ notes, clickHandler }) => {
  // const postNote = e => {
  //   const note = { note: e.target.note.value };

  //   switch (cardType) {
  //   case 'outreach':
  //     addNote(studentId, cardId, note);
  //     break;
  //   case 'intervention':
  //     addNote(studentId, cardId, note);
  //     break;
  //   default:
  //     addNote(studentId, note);
  //     break;
  //   }
  // };

  const renderNote = (note, i) => {
    let date;
    date = new Date(note.date || note.updatedAt).toDateString();
    return (
      <div className="note-display">
        <Chip className="chip-style">
          {date}
        </Chip>
        <p>{note.note}</p>
      </div>
    );
  };

  return (
    <div className="notes-container">
      <div className="add-notes input-group">
        <input type="text" className="form-control" placeholder="Search for..." />
        <span className="input-group-btn">
          <button className="btn btn-secondary" type="button">Go!</button>
        </span>
      </div>
      <div className="note-list">
        {notes.map((note, i) =>
          <div className="note-line" key={note._id}>
            <span className="note-date">{formatDate(new Date(note.date || note.updatedAt))}</span> &nbsp;
            {note.note}
            {i !== notes.length - 1 && <hr />}
          </div>
        )}
      </div>
    </div>
  );
};

StudentNotes.propTypes = {
  studentId : PropTypes.string,
  cardId    : PropTypes.string,
  cardType  : PropTypes.string,
  notes     : PropTypes.array,
  addNote   : PropTypes.func
};

export default StudentNotes;

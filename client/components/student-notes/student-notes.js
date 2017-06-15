import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';

import './student-notes.scss';

const StudentNotes = ({ studentId, cardId, cardType, notes, addNote }) => {
  const postNote = e => {
    e.preventDefault();
    const note = { note: e.target.note.value };

    switch (cardType) {
    case 'outreach':
      addNote(studentId, cardId, note);
      break;
    case 'intervention':
      addNote(studentId, cardId, note);
      break;
    default:
      addNote(studentId, note);
      break;
    }

    e.target.reset();
  };

  const renderNote = (note, i) => {
    let date;
    if(cardType !== undefined) {
      date = new Date(note.date).toDateString();
    } else {
      date = new Date(note.createdAt).toDateString();
    }
    return (
      <div className="note-display" key={i}>
        <Chip className="chip-style">
          {date}
        </Chip>
        <p>{note.note}</p>
      </div>
    );
  };

  return (
    <div className="notes-container">
      <form name="postNote" onSubmit={postNote}>
        <TextField
          id="post-note-field"
          name="note"
          hintText="Type your note here" />
        <RaisedButton
          icon={<FontIcon className="fa fa-plus" />}
          type="submit"
          primary />
      </form>
      <div className={`note-window ${cardType ? 'card' : ''}`}>
        {notes.map(renderNote)}
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

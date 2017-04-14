import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

const styles = {
  chip : {
    margin : 4,
  },
  wrapper : {
    display  : 'flex',
    flexWrap : 'wrap',
  },
};

const Notes = ({ notes, postNote, editNote }) =>
  <div>
    <form onSubmit={postNote}>
      <TextField
        id="post-note-field"
        hintText="Type your note here"/>
      <RaisedButton
        label="Submit"
        type="submit"
        primary
      />
    </form>
    {notes
      && notes.map((note, i) =>
      <div key={i} style={styles.wrapper}>
        <Chip
          onTouchTap={editNote}
          style={styles.chip}
        >
          <Avatar src={note.user.google.image.url} />
          {note.user.google.displayName}: {note.note}
        </Chip>
      </div>
    )}
  </div>
;
export default Notes;

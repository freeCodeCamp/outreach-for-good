import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import './Notes.scss';

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
  <div className="notes">
    <form onSubmit={postNote}>
      <TextField
        id="post-note-field"
        hintText="Type your note here" />
      <RaisedButton
        icon={<FontIcon className="fa fa-plus" />}
        type="submit"
        primary />
    </form>
    {notes
      && notes.map((note, i) =>
      <div key={i} style={styles.wrapper}>
        <Chip
          onTouchTap={editNote}
          style={styles.chip}>

          <Avatar src={note.user.google.image.url} />

          {note.user.google.displayName}: {note.note}
        </Chip>
      </div>
    )}
  </div>
;
export default Notes;

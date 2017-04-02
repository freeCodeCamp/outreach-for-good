import React from 'react';
import TextField from 'material-ui/TextField';

const Notes = ({ notes }) =>
  <div>
    <TextField />
    {notes
      && <ul>
        {notes.map(note => console.log(note))}
      </ul>
    }
  </div>
;
export default Notes;

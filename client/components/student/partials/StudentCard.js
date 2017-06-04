import React, {PropTypes} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';

const StudentCard = ({ title, subtitle, cardId, notes, addNote }) =>
<Card className="card">
  <CardHeader
    title={title}
    subtitle={subtitle} />
  <CardText>
    <div className="notes-container">
      <form
        onSubmit={addNote}
        id={cardId}>
        <TextField
          hintText="Add a note"
          name="cardNote" />
          <FlatButton
            icon={<ContentAdd />}
            type="submit" />
          </form>
          <div className="notes">
            {notes.map((note, i) =>
              <p key={i}>
                <b>({new Date(note.date).toDateString()})</b>
                &nbsp; {note.note}
              </p>
            )}
          </div>

    </div>
  </CardText>
</Card>;

// StudentCard.propTypes = {
//   outreaches : PropTypes.array
// };

export default StudentCard;

import React, {PropTypes} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

const Outreaches = ({ outreach, outreachId, outreachNote, outreachAction }) =>
<Card className="outreach-card">
  <CardHeader
    title={`${outreach.type} (${outreach.absences} absences)`}
    subtitle={`Triggered: ${new Date(outreach.triggerDate).toDateString()}`} />
  <CardText>
    <div className="outreach-card-text-container">
      <div className="left-column">
        <DatePicker id={outreachId}
          onTouchTap={outreachAction}
          hintText="Date Action Taken"/>
      </div>
      <div className="right-column">
        <form
          onSubmit={outreachNote}
          id={outreachId}>
          <TextField
            hintText="Add a note to this outreach"
            name="outreachNote" />
            <FlatButton
              icon={<ContentAdd />}
              type="submit" />
        </form>
        <div className="outreach-notes">
          {outreach.notes.map((note, i) =>
          <p key={i}>
            <b>({new Date(note.date).toDateString()})</b>
            &nbsp; {note.note}
          </p>
          )}
        </div>
      </div>
    </div>
  </CardText>
</Card>;

Outreaches.propTypes = {
  outreaches : PropTypes.array
};

export default Outreaches;

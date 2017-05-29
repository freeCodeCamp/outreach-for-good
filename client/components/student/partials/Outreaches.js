import React, {PropTypes} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

// import StudentCard from './StudentCard';

const cardStyle = {
  width         : '50%',
  display       : 'inline-block',
  height        : '400px',
  verticalAlign : 'top'
};

const wrapper = {
  display  : 'flex',
  flexWrap : 'wrap'
};

const Outreaches = ({ outreaches, outreachNote, outreachAction }) =>
<div className="outreach-cards">
    {outreaches.map((outreach, i) =>
    <Card
      key={i}
      style={cardStyle}>
      <CardHeader
        title={`${outreach.type} (${outreach.absences} absences)`}
        subtitle={`Triggered: ${new Date(outreach.triggerDate).toDateString()}`} />
      <CardText>
        <DatePicker
          onChange={outreachAction}
          hintText="Date Action Taken"/>
        <form id={outreach._id}
          onSubmit={outreachNote}>
          <TextField
            hintText="Add a note to this outreach"
            name="outreachNote" />
          <FlatButton
            icon={<ContentAdd />}
            type="submit" />
        </form>
        <div >
          {outreach.notes.map((note, j) =>
            <span style={wrapper} key={j}>
              <Chip>
                {new Date(note.date).toDateString()}
              </Chip>
              {note.note}
            </span>
          )}
        </div>
      </CardText>
    </Card>
    )}
  </div>;

Outreaches.propTypes = {
  outreaches : PropTypes.array
};

export default Outreaches;

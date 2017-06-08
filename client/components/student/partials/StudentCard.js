import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import DatePicker from 'material-ui/DatePicker';
import Notes from './Notes';

const StudentCard = ({ cardType, cardId, cardData, addNote }) => {
  let title, subTitle,
    actionTrigger = false;

  if(cardType === 'outreach') {
    title = `${cardData.type} (${cardData.absences} Absences)`;
    subTitle = `Trigged: ${new Date(cardData.triggerDate).toDateString()}`;
    actionTrigger = true;
  } else if(cardType === 'intervention') {
    title = `${cardData.type}`;
    subTitle = `${new Date(cardData.createdDate).toDateString()}`;
  }

  return (
    <Card className="card">
      <CardHeader
        title={title}
        subtitle={subTitle} />
      <CardText>
        <Notes
          addNote={addNote}
          cardType={cardType}
          cardId={cardId}
          studentId={cardData.student}
          notes={cardData.notes} />
      </CardText>
      {actionTrigger
        && <CardActions>
        <DatePicker hintText="Trigger Action Date" />
      </CardActions>}
    </Card>
  );
};

export default StudentCard;

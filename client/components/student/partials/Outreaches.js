import React, {PropTypes} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';

// import StudentCard from './StudentCard';

const cardStyle = {
  width : `${50}%`
};
const Outreaches = ({ outreaches }) =>
  <div className="outreach-cards">
    {outreaches.map((outreach, i) =>
    <Card
      key={i}
      style={cardStyle}>
      <CardHeader
        title={outreach.type}
        subtitle={outreach.createdDate}
        actAsExpander
        showExpandableButton
      />
      <CardText expandable>
        {outreach.notes.map((note, j) =>
          <span key={j}>
            <Chip>
              note.date
            </Chip>
            note.note
          </span>
        )}
      </CardText>
    </Card>
    )}
  </div>;

Outreaches.propTypes = {
  outreaches : PropTypes.array
};

export default Outreaches;

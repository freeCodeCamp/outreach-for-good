import React, {PropTypes} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';

import './Interventions.scss';

const cardStyle = {
  width : `${50}%`
};

const Interventions = ({ interventions }) =>
<div className="intervention-cards">
  {interventions.map((intervention, i) =>
  <Card
    key={i}
    style={cardStyle}>
    <CardHeader
      title={intervention.type}
      subtitle={intervention.createdDate}
      actAsExpander
      showExpandableButton
    />
    <CardText expandable>
      {intervention.notes.map((note, j) =>
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

Interventions.propTypes = {
  interventions : PropTypes.array
};

export default Interventions;

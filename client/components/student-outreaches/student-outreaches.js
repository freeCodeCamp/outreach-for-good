import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'material-ui/DatePicker';

import StudentNotes from '../student-notes/student-notes';
import './student-outreaches.scss';

const StudentOutreaches = ({ outreaches, clickHandler }) => {
  return (
    <div className="container-fluid">
      {outreaches.map((outreach, i) =>
      <div className={classnames({row: i % 2 !== 0})}>
        <div className="col-data col-md-6" key={'outreach-' + i}>
          <div className="col-heading">
            {outreach.type + ' #' + outreach.tier}
            &nbsp;
            <span className="absence-annotation">
              ({outreach.absences} Absences)
            </span>
          </div>
          <div className="outreach-card">
            <div className="outreach-info">
          {`Trigged: ${new Date(outreach.triggerDate).toDateString()}`}
            </div>
            <div className="outreach-notes">
          
          {/* <StudentNotes
            addNote={addNote}
            cardType={cardType}
            cardId={cardId}
            studentId={cardData.student}
            notes={cardData.notes}
          /> */}

          <DatePicker hintText="Trigger Action Date" />
            </div>
          </div>
        </div>
      </div>)};
    </div>
  );
};

export default StudentOutreaches;

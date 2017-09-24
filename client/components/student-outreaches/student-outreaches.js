import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'material-ui/DatePicker';

import StudentNotes from '../student-notes/student-notes';
import { formatDate } from '../../utils/date';
import './student-outreaches.scss';

class StudentOutreaches extends React.Component {
  state = {
    datePickers : {}
  }

  datePickerClick = i => {
    this.state.datePickers[i].focus();
  };

  datePickerChange = (date, outreachId) => {
    this.props.clickHandler('updateOutreachAction', outreachId, {actionDate: date.toString()});
  };

  updateData = i => {
    console.log('outreach-date-picker-' + i);
    this.state.datePickers[i].focus();
  };

  render() {
    return (
      <div className="outreach-container container-fluid">
        {this.props.outreaches.map((outreach, i) =>
        <div
          className={classnames({row: i % 2 !== 0})}
          key={'outreach-' + outreach._id}
        >
          <div className={classnames("col-data col-md-6", {'last-outreach-row': (i === this.props.outreaches.length - 1 && i % 2 === 0)})}>
            <div className="col-heading">
              {outreach.type + ' #' + outreach.tier}
              &nbsp;
              <span className="absence-annotation">
                ({outreach.absences} Absences)
              </span>
            </div>
            <div className="outreach-card">
              <div className="outreach-info">
                <div className="outreach-info-label">Trigered</div>
                <div className="outreach-info-data">{formatDate(new Date(outreach.triggerDate))}</div>
                <div className="outreach-info-label">
                  Action Taken <i className="fa fa-calendar" onClick={() => this.datePickerClick(i)}/>
                </div>
                <DatePicker
                  onChange={(e, date) => this.datePickerChange(date, outreach._id)}
                  ref={(input) => { this.state.datePickers[i] = input; }}
                  id={"outreach-date-picker-" + i}
                  style={{visibility: 'hidden', width: 1, height: 1}}
                />
                <div className="outreach-info-data">{outreach.actionDate && formatDate(new Date(outreach.actionDate))}&nbsp;</div>
              </div>
              <div className="outreach-notes">
                <StudentNotes
                  clickHandler={this.props.clickHandler}
                  notes={outreach.notes}
                />
              </div>
            </div>
          </div>
        </div>)}
      </div>
      );
    }
}

StudentOutreaches.propTypes = {
  outreaches   : PropTypes.array,
  clickHandler : PropTypes.func
};

export default StudentOutreaches;

import React from 'react';

import './student-summary-card.scss';

const formatDate = date => {
  date = new Date(date);

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const getNotes = notes => {
  if(notes.length > 0) {
    return notes && notes.map((note, i) =>
      <li key={i}>
        <b>{ formatDate(note.date || note.createdAt) }</b> - {note.note}
      </li>);
  }
};
const StudentSummaryCard = ({ student, absenceRecords, outreaches, interventions, notes }) =>
<div className="summary">
  <div className="print-area">
    <h2>{student.firstName} {student.lastName}</h2>
    {student.school
    && <div><b>School:</b> { student.school.name }</div>}
    <div>
      <b>Student id:</b>
      {student.studentId}
    </div>
    <div>
      <b>IEP:</b>
      {student.iep
        ? 'yes'
        : 'no'}
    </div>
    <div>
      <b>CFA:</b>
      {student.cfa
        ? 'yes'
        : 'no'}
    </div>

    <h3>Attendance Records</h3>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Absences</th>
          <th>Δ Absences</th>
          <th>Tardies</th>
          <th>Δ Tardies</th>
          <th>Present</th>
          <th>Enrolled</th>
          <th>P/E %</th>
        </tr>
      </thead>
      <tbody>
        {absenceRecords.map((record, i) =>
          <tr key={i}>
            <td>{ formatDate(record.date) }</td>
            <td>{ record.entry.absences }</td>
            <td>{ record.entry.absencesDelta }</td>
            <td>{ record.entry.tardies }</td>
            <td>{ record.entry.tardiesDelta }</td>
            <td>{ record.entry.present }</td>
            <td>{ record.entry.enrolled }</td>
            <td>{ +(record.entry.present / record.entry.enrolled * 100).toFixed(1) }</td>
          </tr>
          )}
      </tbody>
    </table>

    <h3>Outreaches</h3>
    {outreaches.length
    ? outreaches.map((outreach, i) =>
      <div key={i}>
        <h4>{ outreach.type } #{ outreach.tier }</h4>
        <div className="dates">
          <b>Triggered:</b> { formatDate(outreach.triggerDate) }

          <b>Resolved:</b> {outreach.actionDate && formatDate(outreach.actionDate) }

        </div>
        {outreach.notes.length > 0
        && <div>
            <b>Notes:</b><br/>
            <ul>
            {getNotes(outreach.notes)}
            </ul>
          </div>}
      </div>)
    : <div><em>No outreaches.</em></div>}


    <h3>Interventions</h3>
    {interventions.length
    ? interventions.map((intervention, i) =>
      <div key={i}>
        <h4>{ intervention.type }</h4>
        <div className="dates">
          <div><b>Created:</b> { formatDate(intervention.createdDate) }</div>
        </div>
        {intervention.notes.length
          && <div>
          <b>Notes:</b><br/>
          <ul>
            {getNotes(intervention.notes)}
          </ul>
        </div>}
      </div>)
    : <div><em>No interventions.</em></div>}


    <h3>Notes</h3>
    {notes.length
    ? <ul>
        {getNotes(notes)}
      </ul>
    : <em>No other notes.</em>}
  </div>
</div>;

export default StudentSummaryCard;

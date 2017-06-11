import React from 'react';

import './student-summary-card.scss';

const formatDate = date => {
  date = new Date(date);

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const getNotes = notes => {
  if(notes.length > 0) {
    return notes.map((note, i) =>
      <li key={i}>
        <b>{ formatDate(note.date || note.createdAt) }</b> - {note.note}
      </li>);
  }
};
const Summary = ({ student }) =>
<div className="summary">
  <div className="print-area">
    <h2>{student.student.firstName} {student.student.lastName}</h2>
    {student.student.school
    && <div><b>School:</b> { student.student.school.name }</div>}
    <div>
      <b>Student id:</b>
      {student.student.studentId}
    </div>
    <div>
      <b>IEP:</b>
      {student.student.iep
        ? 'yes'
        : 'no'}
    </div>
    <div>
      <b>CFA:</b>
      {student.student.cfa
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
        {student.records.map((record, i) =>
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
    {student.outreaches.length
    ? student.outreaches.map((outreach, i) =>
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
    {student.interventions.length
    ? student.interventions.map((intervention, i) =>
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
    {student.notes.length
    ? <ul>
        {getNotes(student.notes)}
      </ul>
    : <em>No other notes.</em>}
  </div>
</div>;

export default Summary;

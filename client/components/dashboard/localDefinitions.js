import React from 'react';
import * as locAct from './localActions';

export const absenceRecordTableColumns = [{
  title    : 'Last Name',
  id       : 'student.lastName',
  width    : 125,
  flexGrow : 1,
  fixed    : true
}, {
  title    : 'First Name',
  id       : 'student.firstName',
  width    : 125,
  flexGrow : 1
}, {
  title    : 'School',
  id       : 'school.name',
  width    : 125,
  flexGrow : 1
}, {
  title    : 'Student ID',
  id       : 'student.studentId',
  width    : 90,
  flexGrow : 1
}, {
  title    : 'Grade',
  id       : '',
  width    : 60,
  flexGrow : 1
}, {
  title    : 'Absences',
  id       : 'entry.absences',
  width    : 100,
  flexGrow : 1
}, {
  title    : 'Δ',
  id       : 'entry.absencesDelta',
  width    : 50,
  flexGrow : 1
}, {
  title    : 'Tardies',
  id       : 'entry.tardies',
  width    : 100,
  flexGrow : 1
}, {
  title    : 'Δ',
  id       : 'entry.tardiesDelta',
  width    : 50,
  flexGrow : 1
}, {
  title    : 'Present',
  id       : 'entry.present',
  width    : 75,
  flexGrow : 1
}, {
  title    : 'Enrolled',
  id       : 'entry.enrolled',
  width    : 75,
  flexGrow : 1
}, {
  title    : 'IEP',
  id       : 'student.iep',
  width    : 50,
  flexGrow : 1
}, {
  title    : 'CFA',
  id       : 'student.cfa',
  width    : 50,
  flexGrow : 1
}, {
  title    : 'Updated',
  id       : '',
  width    : 75,
  flexGrow : 1
}];

export const filterButtonMenuItems = [{
  text     : 'Withdrawn Students',
  actionID : locAct.ALL_YEARS
}, {
  text : 'Divider',
}, {
  text     : 'All Years',
  actionID : locAct.ALL_YEARS
}, {
  text     : '2016-2017',
  actionID : locAct.Y2016_Y2017
}, {
  text     : '2015-2016',
  actionID : locAct.Y2015_Y2016
}];

export const editButtonMenuItems = [{
  text :
    <div>
      <i className="fa fa-plus-circle dashboard-circle-plus" />
      &nbsp; IEP Selected
    </div>,
  actionID : locAct.IEP_ADD
}, {
  text :
    <div>
      <i className="fa fa-minus-circle dashboard-circle-minus" />
      &nbsp; IEP Selected
    </div>,
  actionID : locAct.IEP_REMOVE
}, {
  text : 'Divider',
}, {
  text :
    <div>
      <i className="fa fa-plus-circle dashboard-circle-plus" />
      &nbsp; CFA Selected
    </div>,
  actionID : locAct.CFA_ADD
}, {
  text :
    <div>
      <i className="fa fa-minus-circle dashboard-circle-minus" />
      &nbsp; CFA Selected
    </div>,
  actionID : locAct.CFA_REMOVE
}, {
  text : 'Divider',
}, {
  text :
    <div>
      <i className="fa fa-plus-circle dashboard-circle-plus" />
      &nbsp; Withdraw Selected
    </div>,
  actionID : locAct.WITHDRAW_STUDENT
}, {
  text :
    <div>
      <i className="fa fa-minus-circle dashboard-circle-minus" />
      &nbsp; Withdraw Selected
    </div>,
  actionID : locAct.ENROLL_STUDENT
}];

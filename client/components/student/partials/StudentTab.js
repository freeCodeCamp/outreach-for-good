import React from 'react';
import {Tab} from 'material-ui/Tabs';
import StudentCard from './StudentCard';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const StudentTab = ({ label }) =>
  <Tab
    label={label}
    >
    <FloatingActionButton>
      <ContentAdd />
    </FloatingActionButton>
    <StudentCard
    />
  </Tab>
;
export default StudentTab;

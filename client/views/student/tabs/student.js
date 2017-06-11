import React from 'react';

import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Tab } from 'material-ui/Tabs';

import StudentCard from '../../../components/student-card/student-card';

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

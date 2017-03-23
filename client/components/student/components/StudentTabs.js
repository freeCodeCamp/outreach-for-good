import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import StudentCard from './StudentCard';

const StudentTabs = () =>
  <Tabs>
    <Tab label="Outreaches" >
      <div>
        <h2>Tab One</h2>
        <StudentCard />
      </div>
    </Tab>
    <Tab label="Interventions" >
      <div>
        <h2>Tab Two</h2>
        <p>
          This is another example tab.
        </p>
      </div>
    </Tab>
    <Tab label="Parents">
      <div>
        <h2>Tab Three</h2>
        <p>
          This is a third example tab.
        </p>
      </div>
    </Tab>
    <Tab label="Notes">
      <div>
        <h2>Tab Three</h2>
        <p>
          This is a third example tab.
        </p>
      </div>
    </Tab>
    <Tab label="Summary">
      <div>
        <h2>Tab Three</h2>
        <p>
          This is a third example tab.
        </p>
      </div>
    </Tab>
  </Tabs>
;
export default StudentTabs;

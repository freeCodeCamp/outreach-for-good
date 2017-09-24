import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'material-ui/Checkbox';

const StudentInfoPane = ({ student, clickHandler }) => {

  const onIepToggle = (event, value) => {
    clickHandler('setIep', value);
  };

  const onCfaToggle = (event, value) => {
    clickHandler('setCfa', value);
  };

  const onWithdrawnToggle = (event, value) => {
    clickHandler('setWithdrawn', value);
  };

  return (
    <div className="student-info">
      <div className="student-settings">
        <Checkbox
          label="IEP"
          name="iep"
          onCheck={onIepToggle}
          checked={student.iep}
          labelStyle={{fontWeight: 400}}
          inputStyle={{width: '100px'}}
        />
        <Checkbox
          label="CFA"
          name="cfa"
          onCheck={onCfaToggle}
          checked={student.cfa}
          labelStyle={{fontWeight: 400}}
          inputStyle={{width: '100px'}}
        />
        <Checkbox
          label="Withdrawn"
          name="withdrawn"
          onCheck={onWithdrawnToggle}
          checked={student.withdrawn}
          labelStyle={{fontWeight: 400}}
          inputStyle={{width: '100px'}}
        />
      </div>
      <div className="student-data">
        <b>School:</b> {student.school.name}<br />
        <b>Grade:</b> {student.grade}
      </div>
    </div>);
};

StudentInfoPane.propTypes = {
  student : PropTypes.object.isRequired
};

export default StudentInfoPane;

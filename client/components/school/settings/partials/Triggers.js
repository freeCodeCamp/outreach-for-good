import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';

const Triggers = ({ triggers, onChange }) =>
  <div className="trigger-list">
    {triggers.map((trigger, i) =>
      <TextField key={i}
        id={`${trigger.get('type')} ${trigger.get('tier')}`}
        type="number"
        value={trigger.get('absences')}
        onChange={onChange}
        floatingLabelText={`${trigger.get('type')} ${trigger.get('tier')}`} />
    )}
  </div>
;

Triggers.propTypes = {
  triggers : PropTypes.object
};

export default Triggers;

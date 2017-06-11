import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

const Triggers = ({ triggers, onChange }) =>
  <div className="trigger-list">
    {triggers
      && triggers.map((trigger, i) =>
      <TextField key={i}
        id={`${i}`}
        type="number"
        value={trigger.get('absences')}
        onChange={onChange}
        floatingLabelText={`${trigger.get('type')} ${trigger.get('tier')}`} />
    )}
  </div>
;

Triggers.propTypes = {
  triggers : PropTypes.object,
  onChange : PropTypes.func
};

export default Triggers;

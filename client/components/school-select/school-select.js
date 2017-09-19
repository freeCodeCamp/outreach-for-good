import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const SchoolSelect = ({ schools, value, changeSchool, fullWidth = false, disabled }) =>
  <SelectField
    floatingLabelText="Select a School"
    floatingLabelStyle={{fontWeight: 400}}
    style={{textAlign: 'left'}}
    value={value}
    onChange={changeSchool}
    fullWidth={fullWidth}
    disabled={disabled}
    >
    {schools.map((school, i) =>
      <MenuItem
        key={i}
        value={school}
        primaryText={school.name} />
      )}
  </SelectField>
;

SchoolSelect.propTypes = {
  disabled       : PropTypes.bool,
  schools        : PropTypes.object,
  selectedSchool : PropTypes.object,
  changeSchool   : PropTypes.func,
  value          : PropTypes.object,
  fullWidth      : PropTypes.bool
};

export default SchoolSelect;

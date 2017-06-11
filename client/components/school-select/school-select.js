import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const SchoolSelect = ({ schools, value, changeSchool }) =>
  <SelectField
    floatingLabelText="Select a school..."
    value={value}
    onChange={changeSchool}
    fullWidth
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
  schools        : PropTypes.object,
  selectedSchool : PropTypes.object,
  changeSchool   : PropTypes.func
};

export default SchoolSelect;

import React from 'react';
import PropTypes from 'prop-types';

import { FormControlLabel, Checkbox } from '@material-ui/core';

const { v4: uuidv4 } = require('uuid');

function CustomCheckbox({ checked, label, onChange, color }) {
  const uuid = uuidv4();

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          name={uuid}
          color={color}
        />
      }
      label={label}
    />
  );
}

CustomCheckbox.prototypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
};

CustomCheckbox.defaultProps = {
  color: 'primary',
};

export default CustomCheckbox;

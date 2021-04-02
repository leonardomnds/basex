import React from 'react';
import PropTypes from 'prop-types';

import {
  makeStyles,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
} from '@material-ui/core';

import AddCircleIcon from '@material-ui/icons/AddCircleRounded';

const { v4: uuidv4 } = require('uuid');

const useStyles = makeStyles((theme) => ({
  themeError: {
    color: theme.palette.background.paper,
  },
  box: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    color: '#555555',
    lineHeight: 1.2,
    display: 'block',
    width: '100%',
    background: 'transparent',
  },
}));

export const getSelectItem = (value, text) => {
  return { value, text };
};

getSelectItem.prototypes = {
  value: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function CustomSelect({
  label,
  disabled,
  value,
  setValue,
  autoFocus,
  items,
  itemZero,
  btnAction,
}) {
  const classes = useStyles();
  const uuid = uuidv4();
  return (
    <Box className={classes.box}>
      <FormControl className={classes.input}>
        <InputLabel htmlFor={uuid}>{label}</InputLabel>
        <Select
          labelId={uuid}
          id={uuid}
          value={value}
          autoComplete="off"
          disabled={disabled}
          autoFocus={autoFocus}
          fullWidth
          onChange={(event) => setValue(event.target.value)}
        >
          {itemZero && <MenuItem value="">-</MenuItem>}
          {items.map((item, key) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <MenuItem key={key} value={item.value}>
                {item.text}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {btnAction && (
        <Tooltip title="Cadastrar" placement="top" arrow>
          <IconButton
            size="small"
            color="primary"
            component="span"
            onClick={btnAction}
          >
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

CustomSelect.prototypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  items: PropTypes.array,
  itemZero: PropTypes.bool,
  btnAction: PropTypes.func,
};

CustomSelect.defaultProps = {
  items: [],
  itemZero: true,
};

export default CustomSelect;

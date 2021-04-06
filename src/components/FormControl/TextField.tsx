import React, { ReactNode } from 'react';

import {
  makeStyles,
  Input,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@material-ui/core';

const { v4: uuidv4 } = require('uuid');

const useStyles = makeStyles((theme) => ({
  themeError: {
    color: theme.palette.background.paper,
  },
  input: {
    color: '#555555',
    lineHeight: 1.2,
    display: 'block',
    width: '100%',
    background: 'transparent',
  },
}));

export const getEndItemIconButton = (
  icon: ReactNode,
  onClick: () => void,
  tooltip: string = ''
) => (
  <InputAdornment position="end">
    <Tooltip title={tooltip} placement="top" arrow>
      <IconButton onClick={onClick}>{icon}</IconButton>
    </Tooltip>
  </InputAdornment>
);

type Props = {
  label: string,
  type?: string,
  disabled?: boolean,
  value: string,
  setValue?: (v: any) => void,
  autoFocus?: boolean,
  endItem?: ReactNode,
}

function CustomTextField({
  label,
  type = 'text',
  disabled,
  value,
  setValue = (v) => {},
  autoFocus,
  endItem,
}: Props) {
  const classes = useStyles();

  const uuid = uuidv4();

  return (
    <FormControl className={classes.input}>
      <InputLabel htmlFor={uuid}>{label}</InputLabel>
      <Input
        id={uuid}
        name={uuid}
        type={type}
        value={value || ''}
        autoComplete="off"
        disabled={disabled}
        autoFocus={autoFocus}
        fullWidth
        onChange={(event) => setValue && setValue(event.target.value)}
        endAdornment={endItem && endItem}
      />
    </FormControl>
  );
}

export default CustomTextField;

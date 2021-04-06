import React, { ReactNode } from 'react';

import { makeStyles, Button, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
  btn: {
    minWidth: 120,
  },
  buttonProgress: {
    top: '50%',
    left: '50%',
    marginLeft: -13,
    marginTop: -13,
    position: 'absolute',
  },
});

type Props = {
  label: string,
  func?: () => void,
  icon?: ReactNode,
  isLoading?: boolean,
  color?: "inherit" | "primary" | "secondary",
}

function CustomButton({ label, func = ()=>{}, icon, isLoading, color='primary' }: Props) {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      color={color}
      disabled={isLoading}
      className={classes.btn}
      startIcon={icon && icon}
      onClick={func}
    >
      {label}
      {isLoading && (
        <CircularProgress
          size={26}
          color={color}
          className={classes.buttonProgress}
        />
      )}
    </Button>
  );
}

export default CustomButton;

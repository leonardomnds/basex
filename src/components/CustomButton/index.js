import React from 'react';
import PropTypes from 'prop-types';

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

function CustomButton({ label, func, icon, isLoading, color }) {
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

CustomButton.propTypes = {
  label: PropTypes.string.isRequired,
  func: PropTypes.func,
  icon: PropTypes.element,
  isLoading: PropTypes.bool,
  color: PropTypes.string,
};

CustomButton.defaultProps = {
  func: () => {},
  icon: null,
  isLoading: false,
  color: 'primary',
};

export default CustomButton;

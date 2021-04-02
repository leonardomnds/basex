import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Fab } from '@material-ui/core';

import AddCircleIcon from '@material-ui/icons/AddCircleOutlineRounded';

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: 0,
    top: 'auto',
    left: 'auto',
    bottom: 20,
    right: 20,
    position: 'fixed',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

function CustomFab({ icon, label, onClick }) {
  const classes = useStyles();

  const Icon = icon ?? AddCircleIcon;
  return (
    <Fab
      color="secondary"
      variant="extended"
      onClick={onClick}
      className={classes.fab}
    >
      <Icon className={classes.icon} />
      {label}
    </Fab>
  );
}

CustomFab.propTypes = {
  // eslint-disable-next-line react/require-default-props
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CustomFab;

import React from 'react';

import { makeStyles, Box, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9990,
  },
});

function FullLoading() {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <CircularProgress />
    </Box>
  );
}

export default FullLoading;

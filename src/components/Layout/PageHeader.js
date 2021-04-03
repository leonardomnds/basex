import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import {
  makeStyles,
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@material-ui/core';

import AddCircleIcon from '@material-ui/icons/AddCircleOutlineRounded';
import ArrowBackIcon from '@material-ui/icons/ArrowBackRounded';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  leftSection: {
    display: 'flex',
  },
  title: {
    padding: '8px 0px',
    fontWeight: theme.typography.fontWeightMedium,
  },
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
}));

function PageHeader({
  title,
  btnLabel,
  btnFunc,
  btnIcon,
  btnLoading,
  btnBack,
}) {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box className={classes.leftSection}>
          {btnBack && (
            <Tooltip title="Voltar" placement="top" arrow>
              <IconButton
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}

          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
        </Box>
        {btnLabel && (
          <Button
            variant="contained"
            color="primary"
            disabled={btnLoading}
            className={classes.btn}
            startIcon={btnIcon}
            onClick={btnFunc}
          >
            {`${btnLabel}`}
            {btnLoading && (
              <CircularProgress
                size={26}
                color="primary"
                className={classes.buttonProgress}
              />
            )}
          </Button>
        )}
      </Box>
    </Box>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  btnLabel: PropTypes.string,
  btnFunc: PropTypes.func,
  btnIcon: PropTypes.element,
  btnLoading: PropTypes.bool,
  btnBack: PropTypes.bool,
};

PageHeader.defaultProps = {
  btnLabel: null,
  btnFunc: () => {},
  btnIcon: <AddCircleIcon />,
  btnLoading: false,
  btnBack: false,
};

export default PageHeader;

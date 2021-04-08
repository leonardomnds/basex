import cookie from 'js-cookie';
import React, { useEffect } from 'react';

import {
  useTheme,
  makeStyles,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
} from '@material-ui/core';

import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import Account from '../Account';
import useWindowSize from '../../util/WindowSize';

const useStyles = makeStyles((theme) => ({
  appbar: {
    boxShadow: '0px -2px 5px grey',
    zIndex: theme.zIndex.drawer - 1,
    backgroundColor: theme.palette.background.paper,
  },
  toolbar: {
    minHeight: 55,
    paddingLeft: 0,
    paddingRight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuIcon: {
    minWidth: 40,
    cursor: 'pointer',
    paddingLeft: theme.spacing(2),
  },
  logo: {
    cursor: 'pointer',
    color: 'black',
    height: 25,
    marginLeft: theme.spacing(2),
  },
  accountSection: {
    display: 'flex',
    paddingRight: theme.spacing(2),
    alignItems: 'center',
  },
  icon: {},
}));

type Props = {
  isDrawerOpen: boolean,
  setDrawerOpen: () => void,
}

function TopBar(props: Props) {
  const classes = useStyles();
  const size = useWindowSize();
  const theme = useTheme();

  const { isDrawerOpen, setDrawerOpen } = props;

  useEffect(() => {
    if (
      (isDrawerOpen && size.width < theme.breakpoints.values.lg) ||
      (!isDrawerOpen && size.width >= theme.breakpoints.values.lg)
    ) {
      setDrawerOpen();
    }
  }, [size]);

  return (
    <AppBar className={classes.appbar} color="default">
      <Toolbar className={classes.toolbar}>
        <Box display="flex" alignItems="center">
          <Tooltip
            title={`${isDrawerOpen ? 'Fechar' : 'Abrir'} menu`}
            placement="bottom"
            arrow
          >
            <MenuRoundedIcon
              className={classes.menuIcon}
              onClick={() => setDrawerOpen()}
            />
          </Tooltip>
          <img
            src={'/assets/images/logo.svg'}
            alt="logo"
            className={classes.logo}
            style={{ height: 18 }}
          />
        </Box>
        <Box className={classes.accountSection}>
          <Tooltip title="Notificações" placement="bottom" arrow>
            <IconButton className={classes.icon}>
              <NotificationsRoundedIcon />
            </IconButton>
          </Tooltip>
          <Account user={cookie.get('user') || null} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;

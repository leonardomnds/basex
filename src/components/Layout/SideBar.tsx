import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  useTheme,
  makeStyles,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
  Hidden,
} from '@material-ui/core';

import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import DotIcon from '@material-ui/icons/FiberManualRecordRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

import sidebarItems from './sidebarItems';
import useWindowSize from '../../util/WindowSize';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    height: 'calc(100% - 55px)',
    top: 55,
    position: 'fixed',
    overflowY: 'hidden',
    borderRight: 'none',
    backgroundColor: '#343a40',
  },
  drawerMobile: {
    width: 240,
    height: '100%',
    top: 0,
    position: 'fixed',
    overflowY: 'hidden',
    borderRight: 'none',
    backgroundColor: '#343a40',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 55,
    top: 0,
    position: 'absolute',
  },
  drawerContent: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255,255,255,.1)',
    },
  },
  drawerContentMobile: {
    marginTop: 55,
    width: '100%',
    height: 'calc(100% - 55px)',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255,255,255,.1)',
    },
  },
  menuIcon: {
    minWidth: 40,
    cursor: 'pointer',
    color: theme.palette.background.paper,
    paddingLeft: theme.spacing(2),
  },
  logo: {
    cursor: 'pointer',
    color: 'white',
    height: 18,
    marginLeft: theme.spacing(2),
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  itemSelectedBox: {
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    margin: 3,
    borderRadius: 6,
    backgroundColor: theme.palette.primary.main,
  },
  subSelectedBox: {
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    margin: 3,
    borderRadius: 6,
    backgroundColor: theme.palette.background.paper,
  },
  unselectedBox: {
    margin: 3,
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  listItemIcon: {
    minWidth: 40,
    color: theme.palette.background.paper,
  },
  listItemText: {
    color: theme.palette.background.paper,
    userSelect: 'none',
  },
  listItemTextSelected: {
    color: '#343a40',
    userSelect: 'none',
  },
  collapsedIcon: {
    width: 20,
    height: 20,
    color: theme.palette.background.paper,
  },
  iconSubItem: {
    width: 15,
    height: 15,
    marginLeft: theme.spacing(0.5),
    color: theme.palette.background.paper,
  },
  iconSubItemSelected: {
    width: 15,
    height: 15,
    marginLeft: theme.spacing(0.5),
    color: '#343a40',
  },
}));

function Sidebar(props) {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const size = useWindowSize();

  const { isDrawerOpen, setDrawerOpen } = props;

  const [opennedItem, setOpennedItem] = useState(false);
  const [descOpennedItem, setDescOpennedItem] = useState('');
  const [selectedItem, setSelectedItem] = useState('home');

  const isCurrentPath = (path) => {
    return `${router.pathname}/`.includes(path.replace('//', '/'));
  };

  const isSelectedItem = (path) => {
    return selectedItem.includes(path.replace('//', '/'));
  };

  useEffect(() => {
    const basePath = `${router.pathname}/`;

    const item = basePath.substring(0, basePath.slice(5).indexOf('/') + 5);

    const sub = basePath
      .replace(item, '')
      .substring(0, basePath.replace(item, '').slice(5).indexOf('/') + 5);

    setSelectedItem(item);

    if (sub.length > 1) {
      setOpennedItem(true);
      setDescOpennedItem(item);
    }
  }, []);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      className={
        size.width >= theme.breakpoints.values.lg
          ? classes.drawerContent
          : classes.drawerContentMobile
      }
    >
      <List>
        {sidebarItems.map((item, itemKey) => {
          const Icon = item.icon;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={itemKey}>
              <Box
                className={
                  isCurrentPath(item.path)
                    ? classes.itemSelectedBox
                    : classes.unselectedBox
                }
              >
                <ListItem
                  className={classes.listItem}
                  onClick={() => {
                    setOpennedItem(item.path !== selectedItem || !opennedItem);
                    setDescOpennedItem(item.path);
                    setSelectedItem(item.path);
                    if (!item.items) {
                      if (size.width < theme.breakpoints.values.lg) {
                        setDrawerOpen();
                      }
                      router.push(item.path);
                    }
                  }}
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    unselectable="on"
                    primary={item.label}
                    className={classes.listItemText}
                  />
                  {item.items &&
                    (descOpennedItem === item.path && opennedItem ? (
                      <ExpandLessIcon className={classes.collapsedIcon} />
                    ) : (
                      <ExpandMoreIcon className={classes.collapsedIcon} />
                    ))}
                </ListItem>
              </Box>
              {Boolean(item.items) && (
                <Collapse
                  timeout="auto"
                  unmountOnExit
                  in={isSelectedItem(item.path) && opennedItem}
                >
                  {item.items.map((sub, subKey) => {
                    return (
                      <Box
                        // eslint-disable-next-line react/no-array-index-key
                        key={subKey}
                        className={
                          isCurrentPath(`${item.path}/${sub.path}`)
                            ? classes.subSelectedBox
                            : classes.unselectedBox
                        }
                      >
                        <ListItem
                          className={classes.listItem}
                          onClick={() => {
                            if (size.width < theme.breakpoints.values.lg) {
                              setDrawerOpen();
                            }
                            router.push(`${item.path}/${sub.path}`);
                          }}
                        >
                          <ListItemIcon className={classes.listItemIcon}>
                            <DotIcon
                              className={
                                isCurrentPath(`${item.path}/${sub.path}`)
                                  ? classes.iconSubItemSelected
                                  : classes.iconSubItem
                              }
                            />
                          </ListItemIcon>
                          <ListItemText
                            unselectable="on"
                            primary={sub.label}
                            className={
                              isCurrentPath(`${item.path}/${sub.path}`)
                                ? classes.listItemTextSelected
                                : classes.listItemText
                            }
                          />
                        </ListItem>
                      </Box>
                    );
                  })}
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      variant={
        size.width >= theme.breakpoints.values.lg ? 'persistent' : 'temporary'
      }
      onClose={setDrawerOpen}
      classes={{
        paper:
          size.width >= theme.breakpoints.values.lg
            ? classes.drawer
            : classes.drawerMobile,
      }}
    >
      <Hidden lgUp>
        <Box className={classes.header}>
          <Tooltip
            title={`${isDrawerOpen ? 'Fechar' : 'Abrir'} menu`}
            placement="bottom"
            arrow
          >
            <MenuRoundedIcon
              className={classes.menuIcon}
              onClick={setDrawerOpen}
            />
          </Tooltip>
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            className={classes.logo}
          />
        </Box>
      </Hidden>
      {content}
    </Drawer>
  );
}

export default Sidebar;

import cookie from 'js-cookie';

import React, { useState, useRef } from 'react';
import { useRouter } from "next/router";

import { makeStyles, Avatar, Menu, MenuItem } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  avatarMenu: {
    minWidth: 100,
  },
}));

type Props = {
  user: string,
}

function Account(props: Props) {
  const classes = useStyles();
  const ref = useRef();
  const router = useRouter()
  const [isOpen, setOpen] = useState(false);

  const { user } = props;

  const isAuthenticated = Boolean(cookie.get('token'));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    handleClose();
    cookie.remove('user');
    cookie.remove('token');
    const identificador = cookie.get('identificador') || '';    
    router.replace(identificador ? `/${identificador}/login` : '/');
  };

  const handleSignIn = () => {
    handleClose();
    router.replace('/');
  };

  const items = [
    {
      id: 1,
      label: 'Meu Perfil',
      auth: true,
      onClick: () => {},
    },
    {
      id: 2,
      label: 'Sair',
      auth: true,
      onClick: handleSignOut,
    },
    {
      id: 3,
      label: 'Registrar',
      auth: false,
      onClick: () => {},
    },
    {
      id: 1,
      label: 'Fazer Login',
      auth: false,
      onClick: handleSignIn,
    },
  ];

  return (
    <>
      <Avatar
        ref={ref}
        style={{ cursor: 'pointer' }}
        className={classes.avatar}
        onClick={handleOpen}
        alt={user ? JSON.parse(user).nome : null}
        src="/"
      />
      <Menu
        className={classes.avatarMenu}
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isOpen}
        onClose={handleClose}
        getContentAnchorEl={null}
      >
        {items.map((item) => {
          return isAuthenticated === item.auth ? (
            <MenuItem key={item.id} onClick={item.onClick}>
              {item.label}
            </MenuItem>
          ) : null;
        })}
      </Menu>
    </>
  );
}

export default Account;

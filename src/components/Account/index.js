import React, { useState, useRef } from 'react';
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, Avatar, Menu, MenuItem } from '@material-ui/core';

import { signOut } from '../../store/actions/accountAction';
import authService from '../../services/AuthService';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  avatarMenu: {
    minWidth: 100,
  },
}));

function Account() {
  const classes = useStyles();
  const ref = useRef();
  const router = useRouter()
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [isOpen, setOpen] = useState(false);

  const isAuthenticated = !!account.user;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    const identificador = authService.getIdentificadorEmpresa();
    handleClose();
    dispatch(signOut());
    router.replace(`/${identificador}/login`);
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
        alt={account.user ? account.user.nome : ''}
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

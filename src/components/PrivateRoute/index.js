import { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';

import authService from '../../services/AuthService';
import api from '../../util/Api';

import { signOut } from '../../store/actions/accountAction';

function PrivateRoute({ ...rest }) {
  const dispatch = useDispatch();
  const { addToast, removeAllToasts } = useToasts();
  const [identificador, setIdentificador] = useState('');

  useEffect(() => {
    setIdentificador(authService.getIdentificadorEmpresa());

    async function getData() {
      try {
        let exit = false;
        const response = await api.get('/usuarios/profile');

        if (response.data) {
          const { dados } = await response.data;
          if (!dados) {
            exit = true;
          }
        }

        if (exit) {
          removeAllToasts();
          dispatch(signOut());
          addToast(
            'Acesso perdido. Faça login novamente para continuar usando o sistema!',
            { appearance: 'error' },
          );
        }
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    getData();
  }, []);

  return authService.isAuthenticated() ? (
    <Route {...rest} />
  ) : (
    <Navigate to={`/${identificador}/login`} />
  );
}

export default PrivateRoute;

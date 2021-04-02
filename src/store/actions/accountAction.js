import authService from '../../services/AuthService';

export const LOGIN_SUCCESS = '@ACCOUNT/LOGIN_SUCCESS';
export const LOGOUT = '@ACCOUNT/LOGOUT';
export const SILENT_LOGIN = '@ACCOUNT/SILENT_LOGIN';

const signIn = (user, token) => {
  return async (dispatch) => {
    await authService.setToken(token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        user,
      },
    });
  };
};

const signOut = () => {
  return async (dispatch) => {
    await authService.signOut();

    dispatch({
      type: LOGOUT,
    });
  };
};

const setUserData = () => {
  return async (dispatch) => {
    const user = await authService.signInWithToken();

    dispatch({
      type: SILENT_LOGIN,
      payload: {
        user,
      },
    });
  };
};

export { signIn, signOut, setUserData };

export const DRAWER = '@DRAWER/STATE';

const drawerClick = (state) => {
  return async (dispatch) => {
    dispatch({
      type: DRAWER,
      payload: {
        open: state,
      },
    });
  };
};

export default drawerClick;

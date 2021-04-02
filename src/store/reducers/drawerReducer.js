import { DRAWER } from '../actions/drawerAction';

const INITIAL_STATE = {
  open: true,
};

const drawerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DRAWER:
      return {
        ...state,
        open: action.payload.open,
      };
    default:
      return state;
  }
};

export default drawerReducer;

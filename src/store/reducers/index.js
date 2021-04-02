import { combineReducers } from 'redux';

import accountReducer from './accountReducer';
import drawerReducer from './drawerReducer';

const rootReducer = combineReducers({
  account: accountReducer,
  drawer: drawerReducer,
});

export default rootReducer;

import { createStore, applyMiddleware, combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import routeReducer from '../routing/RoutingReducer';
import menuReducer from '../app/MenuReducer';
import appReducer from '../app/AppReducer';


const reducers = combineReducers({
  routeState: routeReducer,
  menuState: menuReducer,
  form: formReducer,
  appState: appReducer
});

const store = createStore(reducers, window.devToolsExtension && window.devToolsExtension());

export default store;


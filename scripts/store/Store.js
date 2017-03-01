import { createStore, applyMiddleware, combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import routeReducer from '../routing/RoutingReducer';
import appReducer from '../app/AppReducer';
import menuReducer from '../menu/MenuReducer';


const reducers = combineReducers({
  route: routeReducer,
  menu: menuReducer,
  form: formReducer,
  appState: appReducer
});

console.log('reducers: ', reducers)

const store = createStore(reducers, window.devToolsExtension && window.devToolsExtension());

export default store;


import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk'
import {reducer as formReducer} from 'redux-form';
import fetchRoute from '../routing/Actions'
import routeReducer from '../routing/RoutingReducer';
import appReducer from '../app/AppReducer';
import menuReducer from '../menu/MenuReducer';


const reducers = combineReducers({
  routes: routeReducer,
  menu: menuReducer,
  form: formReducer,
  appState: appReducer
});

const composeEnhancers = 
  typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware( thunk )
);

const store = createStore( reducers, enhancer );

export default store;


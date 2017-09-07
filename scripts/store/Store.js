import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk'
import {reducer as formReducer} from 'redux-form';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory'
import fetchRoute from '../routing/Actions'
import routeReducer from '../routing/RouteReducer';
import appReducer from '../app/AppReducer';
import menuReducer from '../menu/MenuReducer';


const history = createHistory()

const historyMiddleware = routerMiddleware(history)

const reducers = combineReducers({
  routes: routeReducer,
  menu: menuReducer,
  form: formReducer,
  appState: appReducer,
  router: routerReducer
});

const composeEnhancers = 
  typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware( thunk, historyMiddleware )
);

const store = createStore( reducers, enhancer);

export { store, history };


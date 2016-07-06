import React  from 'react';
import { render }  from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import routes from './app/Router'
import store from './store/Store'

/*
  Main
*/

  
  function requireAuth(nextState, replace) {
    console.log('Testing auth-status')
    console.log(localStorage.loggedin)
    if (localStorage.loggedin !== 'true') {
      console.log('Not logged in, asking for credentials')
      replace({
        pathname: '/login',
        state: {nextPathname: nextState.location.pathname }
      })
    }
  }

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>,
    document.querySelector('#main')
)

import React  from 'react';
import { render }  from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './config/routes'

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

render(<Router history={browserHistory} routes={routes}/>, document.querySelector('#main'))

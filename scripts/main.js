import React  from 'react';
import { render }  from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Hello from './components/Hello';
import Routing from './components/Routing';
import Administration from './components/Administration';
import NotFound from './components/NotFound';

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

  render((
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} onEnter={requireAuth}/>
        <Route path="/login" component={LoginForm}/>
        <Route path="/hello" component={Hello} onEnter={requireAuth}/>
        <Route path="/routing" component={Routing} onEnter={requireAuth}/>
        <Route path="/administration" component={Administration} onEnter={requireAuth}/>
        <Route path="*" component={NotFound}/>
      </Route>
    </Router>
  
  ), document.querySelector('#main'))

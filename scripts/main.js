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
  Routes
*/


function requireAuth(nextState, replace) {
  console.log('Testing auth-status')
  console.log(App.loggedIn())
  if (!App.loggedIn()) {
    console.log('No csrfToken found, asking for login')
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname }
    })
  }
}


function createHello(Hello, props) {
  return <Hello log={App.state.log} fetchLog={App.fetchLog} />
}

render((
  <Router history={hashHistory}>
    <Router createElement={createHello}/>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/login" component={LoginForm}/>
      <Route path="/hello" component={Hello}/>
      <Route path="/routing" component={Routing}/>
      <Route path="/administration" component={Administration}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>

), document.querySelector('#main'))

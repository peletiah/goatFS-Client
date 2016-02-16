import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';

import App from './components/App';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Hello from './components/Hello';
import NotFound from './components/NotFound';

/*
  Routes
*/

var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={App}/>
    <Route path="/login" component={LoginForm}/>
    <Route path="/hello" component={Hello}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));

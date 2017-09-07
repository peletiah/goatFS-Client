import React  from 'react';
import { render }  from 'react-dom';
import { Provider } from 'react-redux'

import { BrowserRouter, Route as ReactRoute, Redirect } from 'react-router-dom';

import { ConnectedRouter, push} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import { store, history } from './store/Store'
import Routes from './routing/Routes'
import Route from './routing/Route'
import LoginForm from './app/LoginForm'
import App from './app/App'

/*
  Main
*/

  
  function isAuthenticated(location) {
    //console.log('Testing auth-status', location)
    if (localStorage.loggedin !== 'true') 
      return false
    else
      return true
  }

const PrivateRoute = ({ component: Component, ...rest }) => (
  <ReactRoute {...rest} render={ props => (
    isAuthenticated(props.location) ? (
      <Component {...props}/>
    ) : (
    <Redirect to={{
      pathname: '/login',
      state: { from: props.location }
    }}/>
  )
  )}/>
)

console.log(store)

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App/>

        <PrivateRoute exact path="/" component={Routes}/>
        <PrivateRoute path="/routes" component={Routes}/>
        <PrivateRoute path="/route/:id" component={Route}/>
        <ReactRoute path="/login" component={LoginForm}/>
      </div>
    </ConnectedRouter>
  </Provider>,
    document.querySelector('#main')
)

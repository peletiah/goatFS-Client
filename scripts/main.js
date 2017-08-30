import React  from 'react';
import { render }  from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import store from './store/Store'
import Routing from './routing/Routing'
import LoginForm from './app/LoginForm'
import App from './app/App'

/*
  Main
*/

  
  function isAuthenticated() {
    console.log('Testing auth-status')
    if (localStorage.loggedin !== 'true') 
      return false
    else
      return true
  }


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={ props => (
    isAuthenticated() ? (
      <Component {...props}/>
    ) : (
    <Redirect to={{
      pathname: '/login',
      state: { from: props.location }
    }}/>
  )
  )}/>
)

render(
  <Provider store={store}>
    <Router>
      <div>
        <App/>

        <Route exact path="/" component={Routing}/>
        <PrivateRoute path="/routing" component={Routing}/>
        <Route path="/login" component={LoginForm}/>
      </div>
    </Router>
  </Provider>,
    document.querySelector('#main')
)

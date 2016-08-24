/* 
  GoatFS Client - Main App
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import cookie from 'react-cookie';
import Menu from '../menu/Menu';
import LoginForm from './LoginForm';
import store from '../store/Store'

@autobind
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      csrfToken : '',
      log : {}
    }
  }

  componentWillMount() {
    this.setCSRFToken()
    this.loggedIn()
  }


  setCSRFToken() {
    console.log('Checking for csrf-cookie')
    store.dispatch({
      type: 'SET_CSRF_TOKEN',
      csrfToken: cookie.load('csrf')
    })
    console.log('csrfToken is '+store.getState().appState.csrfToken)
  }


  loggedIn() {
    return !!this.state.csrfToken
  }


  fetchLog() {
    console.log('Fetching Log from server')
    const csrfToken = store.getState().appState.csrfToken
    fetch('http://localhost:6543/hello', {
      credentials: 'include',
      headers: {
        'X-CSRF-TOKEN': csrfToken
      }
    }).then(r => r.json())
      .then(data => this.setState({
          log : data
      }, console.log(data)))
      .catch(e => console.log("Error"))
    }

  render() {
    return (
      <div>
        <Menu csrfToken={this.state.csrfToken} {...this.props}/>
        {this.props.children /*returns the components propagated by router*/
        && React.cloneElement(this.props.children, {fetchLog: this.fetchLog, log: this.state.log, setCSRFToken: this.setCSRFToken, csrfToken: this.state.csrfToken})}
      </div>
    )
  }
};

export default App    
